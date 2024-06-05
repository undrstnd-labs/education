import React, { cache } from "react"
import { type Metadata } from "next"
import { Link, redirect } from "@navigation"
import { Conversation, File } from "@prisma/client"
import Fuse from "fuse.js"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { getCurrentStudent, getCurrentUser } from "@/lib/session"

import { AccountSharedDeleteFile } from "@/components/app/account-shared-delete-file"
import { AccountSharedSearch } from "@/components/shared/account-shared-search"
import { Icons } from "@/components/shared/icons"
import { PDFPreview } from "@/components/shared/pdf-preview"
import { PDFViewDialogTrigger } from "@/components/shared/pdf-view-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { getChatsWithDetails } from "@/undrstnd/chat"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.pages.shared")
  return {
    title: `${t("metadata-title")}`,
  }
}

const loadChats = cache(async (studentId: string, search: string) => {
  const chats = await getChatsWithDetails(studentId)

  return chats
})

function searchChat(chats: Conversation[], search: string) {
  const fuse = new Fuse(chats, {
    keys: ["title", "messages.text"],
    includeScore: true,
  })

  if (search && search.length > 0) {
    return fuse.search(search).map((result) => result.item) as Conversation[]
  }

  return chats
}

export default async function SharedPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations("app.pages.shared")

  const user = await getCurrentUser()

  if (!user || user.role !== "STUDENT") {
    return redirect("/account")
  }

  const student = await getCurrentStudent(user.id)
  if (!student) {
    return redirect("/account")
  }

  const chats = await loadChats(student.id, searchParams.search as string)
  const searchedChats = searchChat(chats, searchParams.search as string)

  return (
    <main className="flex flex-col gap-4 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("files")}</CardTitle>
          <CardDescription>{t("files-description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountSharedSearch />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <ul
            role="list"
            className="flex flex-grow flex-wrap gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8 xl:gap-x-8"
          >
            {searchedChats &&
            searchedChats.length === 0 &&
            searchParams.search ? (
              <div className="-mt-20 flex h-screen w-full items-center justify-center">
                <div className="relative block w-full max-w-md rounded-lg border-2 border-dashed border-secondary-foreground/20 p-12 text-center transition-all duration-300 hover:border-secondary-foreground/50">
                  <Icons.sleep className="mx-auto size-24 text-secondary-foreground/60" />
                  <span className="text-md mt-2 block font-semibold text-secondary-foreground">
                    {t("no-matching-results")}
                  </span>
                  <p className="mt-2 block text-sm font-normal text-secondary-foreground/60">
                    {t("no-matching-results-description")}
                  </p>
                  <div className="py-6">
                    <Link href="/chat">
                      <Button>{t("create-chat")}</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {searchedChats &&
                  searchedChats.length > 0 &&
                  searchedChats
                    .sort((a: any, b: any) => {
                      const aLastMessage = a.messages.slice(-1)[0]
                      const bLastMessage = b.messages.slice(-1)[0]
                      if (!aLastMessage || !bLastMessage) {
                        return 0
                      }
                      return (
                        new Date(bLastMessage.createdAt).getTime() -
                        new Date(aLastMessage.createdAt).getTime()
                      )
                    })
                    .filter((chat: any) => chat.file && chat.file.url)
                    .map((chat: any) => (
                      <li
                        key={chat.id}
                        className="relative flex-grow basis-1/3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                      >
                        <Link
                          href={chat.file?.url!}
                          target="_blank"
                          className="group aspect-h-7 aspect-w-10 block max-w-xs overflow-hidden rounded-lg border bg-gray-100 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-gray-100 sm:max-w-full"
                        >
                          <PDFPreview file={chat.file as File} />
                          <button
                            type="button"
                            className="absolute inset-0 focus:outline-none"
                          >
                            <span className="sr-only">
                              View details for {chat.title}
                            </span>
                          </button>
                        </Link>
                        <div className="mt-2 flex justify-between">
                          <div>
                            <p className="pointer-events-none block w-32 truncate text-sm font-medium text-secondary-foreground sm:w-full">
                              {chat.title.slice(0, 30)}
                              {chat.title.length > 20 ? "..." : ""}
                            </p>

                            <p className="pointer-events-none block text-sm font-medium text-secondary-foreground/50">
                              {chat.messages.length} {t("messages")}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size={"small-icon"}
                                className="ml-auto"
                              >
                                <Icons.menu />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>
                                {t("more-options")}
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <PDFViewDialogTrigger file={chat.file as File} />
                              <DropdownMenuItem>
                                <Link href={chat.path}>{t("view-chat")}</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AccountSharedDeleteFile chat={chat} />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </li>
                    ))}
              </>
            )}
          </ul>
        </CardContent>
      </Card>
    </main>
  )
}
