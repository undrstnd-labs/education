import React from "react"
import { type Metadata } from "next"
import { redirect } from "@navigation"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { getCurrentUser } from "@/lib/session"

import { Icons } from "@/components/shared/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.pages.shared")
  return {
    title: `${t("metadata-title")}`,
  }
}
const files = [
  {
    title: "IMG_4985.HEIC",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  // More files...
]

// TODO: Preview of the PDF file, name of the conversation and file in MB or amount of messages - a drop down to see file, download file, and clicking on the preview would open the chat
// TODO: create 3 categories : Today, last week, a long time ago (by last message sent)
// TODO: create a search bar
export default async function SharedPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations("app.pages.shared")

  const user = await getCurrentUser()

  if (!user || user.role !== "STUDENT") {
    return redirect("/account")
  }

  return (
    <main className="flex flex-col gap-4 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("files")}</CardTitle>
          <CardDescription>{t("files-description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Input type="text" placeholder="Dark" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <ul
            role="list"
            className="flex flex-grow flex-wrap gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8 xl:gap-x-8"
          >
            {files.map((file) => (
              <li
                key={file.source}
                className="relative flex-grow basis-1/3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                  <img
                    src={file.source}
                    alt=""
                    className="pointer-events-none h-full w-full object-cover group-hover:opacity-75"
                  />
                  <button
                    type="button"
                    className="absolute inset-0 focus:outline-none"
                  >
                    <span className="sr-only">
                      View details for {file.title}
                    </span>
                  </button>
                </div>
                <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                  {file.title}
                </p>
                <p className="pointer-events-none block text-sm font-medium text-gray-500">
                  {file.size}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  )
}
