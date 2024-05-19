import Image from "next/image"
import { redirect } from "@navigation"
import { Student, Teacher, User } from "@prisma/client"
import { unstable_setRequestLocale } from "next-intl/server"

import { NextAuthUser } from "@/types/auth"
import { Classroom } from "@/types/classroom"

import {
  getCurrentEntity,
  getCurrentUser,
  userAuthentificateVerification,
} from "@/lib/session"

import { UserMenu, UserMenuIconDropdown } from "@/components/display/UserMenu"
import { FeedAddClassroom } from "@/components/layout/feed-add-classroom"
import { FeedJoinClassroom } from "@/components/layout/feed-join-classroom"
import { FeedNavigationList } from "@/components/layout/feed-navigation-list"
import { Icons, LogoPNG } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface FeedLayoutProps {
  params: { locale: string }
  children: React.ReactNode
}

async function getClassrooms(user: User) {
  const entity = (await getCurrentEntity(user)) as Student | Teacher
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/classrooms/${user.role.toLowerCase()}/${entity.id}`,
      {
        method: "GET",
        next: {
          revalidate: 0,
        },
      }
    )

    if (res.ok) {
      const data: Classroom[] = await res.json()
      return {
        entity,
        classrooms: data,
      }
    } else {
      return {
        entity,
        classrooms: [],
      }
    }
  } catch (error) {
    console.log(error)
    return {
      entity,
      classrooms: [],
    }
  }
}

export default async function FeedLayout({
  children,
  params: { locale },
}: FeedLayoutProps) {
  unstable_setRequestLocale(locale)

  const user = await getCurrentUser()
  const toRedirect = await userAuthentificateVerification(user as NextAuthUser)

  if (toRedirect) {
    redirect(toRedirect)
  }

  if (!user || !user.name || !user.email || !user.image) {
    return null
  }

  const { entity, classrooms } = await getClassrooms(user)

  return (
    <>
      <div className="lg:hidden">
        <Sheet>
          <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
            <div className="flex h-16 items-center gap-x-4 border-b border-secondary px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
              <SheetTrigger>
                <Button variant={"ghost"} size={"icon"}>
                  <Icons.menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>

              <div
                className="h-6 w-px bg-gray-200 lg:hidden"
                aria-hidden="true"
              />
              <div className="ml-auto">
                <UserMenuIconDropdown user={user} />
              </div>
            </div>
          </div>

          <SheetContent side={"left"} className="w-full">
            <div className="flex grow flex-col gap-y-5 overflow-y-auto px-2 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <LogoPNG className="h-8 w-8" />
              </div>
              <FeedNavigationList user={user} classrooms={classrooms} />
            </div>
            <div className="px-6 pb-4">
              {user.role === "TEACHER" && <FeedAddClassroom teacher={entity} />}
              {user.role === "STUDENT" && (
                <FeedJoinClassroom student={entity} />
              )}
              <Separator className="my-3" />
              <UserMenu user={user}>
                <div
                  className={
                    "flex cursor-pointer items-center gap-x-4 rounded-lg px-6 py-3 text-sm font-semibold leading-6 hover:bg-secondary/50"
                  }
                >
                  <Image
                    src={user.image}
                    alt="Profile image"
                    className="size-10 rounded-full object-cover"
                    width={300}
                    height={300}
                  />
                  <span aria-hidden="true" className="capitalize">
                    {user.name}
                  </span>
                </div>
              </UserMenu>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden border-r border-secondary-foreground/10 bg-secondary/35 px-2 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div
              className={
                "relative z-20 flex w-fit items-center text-lg font-semibold"
              }
            >
              <LogoPNG className="mr-2 size-8" />
              Undrstnd
            </div>
          </div>

          <FeedNavigationList user={user} classrooms={classrooms} />
          <div className="h-20" />
        </div>

        <div className="w-full px-6 pb-4">
          {user.role === "TEACHER" && <FeedAddClassroom teacher={entity} />}
          {user.role === "STUDENT" && <FeedJoinClassroom student={entity} />}
          <Separator className="my-3" />
          <UserMenu user={user}>
            <div
              className={
                "flex cursor-pointer items-center gap-x-4 rounded-lg px-6 py-3 text-sm font-semibold leading-6 hover:bg-secondary/50"
              }
            >
              <Image
                src={user.image}
                alt="Profile image"
                className="size-10 rounded-full object-cover"
                width={300}
                height={300}
              />
              <span aria-hidden="true" className="capitalize">
                {user.name}
              </span>
            </div>
          </UserMenu>
        </div>
      </div>

      <div className="lg:pl-72">{children}</div>
    </>
  )
}
