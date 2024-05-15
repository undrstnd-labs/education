import { redirect } from "@navigation"
import { Student, Teacher, User } from "@prisma/client"

import { NextAuthUser } from "@/types/auth"
import { Classroom } from "@/types/classroom"

import {
  getCurrentEntity,
  getCurrentUser,
  userAuthentificateVerification,
} from "@/lib/session"

import { FeedNavigationList } from "@/components/app/feed-navigation-list"
import { UserMenu, UserMenuIconDropdown } from "@/components/display/UserMenu"
import { Icons } from "@/components/icons/Lucide"
import { LogoPNG } from "@/components/icons/Overall"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet"

interface FeedLayoutProps {
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
      return data
    } else {
      return []
    }
  } catch (error) {
    console.log(error)
    return []
  }
}

export default async function FeedLayout({ children }: FeedLayoutProps) {
  const user = await getCurrentUser()
  const toRedirect = await userAuthentificateVerification(user as NextAuthUser)

  if (toRedirect) {
    redirect(toRedirect)
  }

  if (!user || !user.name || !user.email || !user.image) {
    return null
  }

  const classrooms = await getClassrooms(user)

  return (
    <main>
      <div className="lg:hidden">
        <Sheet>
          <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
            <div className="flex h-16 items-center gap-x-4 border-b border-secondary bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
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
              <FeedNavigationList classrooms={classrooms} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden px-2 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72  lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div
              className={
                "relative z-20 flex w-fit items-center text-lg font-semibold"
              }
            >
              <LogoPNG className="mr-2 size-8" />
              Undrstnd
            </div>{" "}
          </div>

          <FeedNavigationList classrooms={classrooms} />
          <Separator className="my-2" />
          <UserMenu user={user}>
            <div
              className={
                "flex cursor-pointer items-center gap-x-4 rounded-lg px-6 py-3 text-sm font-semibold leading-6 hover:bg-secondary/50"
              }
            >
              <Avatar>
                <AvatarImage src={user.image} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span aria-hidden="true" className="capitalize">
                {user.name}
              </span>
            </div>
          </UserMenu>
        </div>
      </div>

      <div className="lg:pl-72">
        <main className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </main>
  )
}
