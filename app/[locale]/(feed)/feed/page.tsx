import React from "react"
import Image from "next/image"
import { Classroom } from "@/types"
import { Link, redirect } from "@navigation"
import { Student, Teacher, User } from "@prisma/client"
import { getTranslations } from "next-intl/server"

import { NextAuthUser } from "@/types/auth"

import {
  getCurrentEntity,
  getCurrentUser,
  userAuthentificateVerification,
} from "@/lib/session"
import { cn, processActivities } from "@/lib/utils"

import { Icons } from "@/components/icons/Lucide"
import { buttonVariants } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

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

export default async function FeedPage() {
  const t = await getTranslations("app.pages.feed")
  const user = await getCurrentUser()
  const toRedirect = await userAuthentificateVerification(user as NextAuthUser)

  if (toRedirect) {
    redirect(toRedirect)
  }

  if (!user || !user.name || !user.email || !user.image) {
    return null
  }

  const classrooms = (await getClassrooms(user)) as Classroom[]
  const activities = processActivities(classrooms, t)

  return (
    <main className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="py-4 text-2xl font-semibold">{t("feed")}</h1>
        <div className="flow-root space-y-3">
          {activities.length === 0 && (
            <div className="flex h-96 items-center justify-center">
              <p className="text-gray-500">{t("noActivities")}</p>
            </div>
          )}
          {activities.map((classroomActivities, idx) => (
            <Card className="p-6">
              <ul role="list" className="-mb-8">
                {classroomActivities.map((activityItem, activityItemIdx) => (
                  <li key={activityItem.id}>
                    <div className="relative pb-8">
                      {activityItemIdx !== activities.length - 1 ? (
                        <span
                          className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-secondary-foreground/20"
                          aria-hidden="true"
                        />
                      ) : null}

                      <div className="relative flex items-start space-x-3">
                        {activityItem.type === "post" ? (
                          <>
                            <div className="relative">
                              <Image
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary ring-4 ring-secondary"
                                src={activityItem.imageUrl}
                                alt={activityItem.user.name}
                                width={40}
                                height={40}
                              />

                              <span className="absolute -bottom-2 -right-3 rounded-lg rounded-tl bg-secondary px-0.5 py-px">
                                <Icons.post
                                  className="h-5 w-5 bg-secondary"
                                  aria-hidden="true"
                                />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium text-secondary-foreground">
                                    {activityItem.user.name}{" "}
                                    <span className="text-sm font-light">
                                      - {activityItem.date}
                                    </span>
                                  </span>
                                </div>
                                <p className="mt-0.5 text-sm text-secondary-foreground/60">
                                  {t("posted")} @{" "}
                                  <Link
                                    href={`/classroom/${activityItem.classroom.id}`}
                                    className="font-semibold hover:underline"
                                  >
                                    {activityItem.classroom.name}
                                  </Link>
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-secondary-foreground/70">
                                <p>{activityItem.comment}</p>
                              </div>
                            </div>
                            <Link
                              href={`/classroom/${activityItem.classroom.id}#${activityItem.id}`}
                              className={cn(
                                buttonVariants({
                                  size: "icon",
                                  variant: "ghost",
                                }),
                                "absolute right-0 top-0 h-5 w-5"
                              )}
                            >
                              <Icons.external className="absolute right-0 top-0 h-5 w-5" />
                            </Link>
                          </>
                        ) : activityItem.type === "comment" ? (
                          <>
                            <div>
                              <div className="relative px-1">
                                <div className="flex size-6 items-center justify-center rounded-full bg-secondary/80 ring-4 ring-secondary/80">
                                  <Image
                                    src={activityItem.imageUrl}
                                    alt={activityItem.user.name}
                                    width={32}
                                    height={32}
                                    className="size-6 rounded-full"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1 py-1.5">
                              <div className="text-sm text-secondary-foreground/40">
                                <span className="font-medium text-secondary-foreground/80">
                                  {activityItem.user.name}
                                </span>{" "}
                                {t("commented")} @{" "}
                                {activityItem.post && (
                                  <Link
                                    href={`/classroom/${activityItem.classroom.id}#${activityItem.post.id}`}
                                    className="font-semibold hover:underline"
                                  >
                                    {activityItem.post.name}
                                  </Link>
                                )}{" "}
                                <span className="text-sm font-light">
                                  - {activityItem.date}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
