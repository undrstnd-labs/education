"use client"

import React from "react"
import Image from "next/image"
import { NavigationList } from "@/types"
import { Link, usePathname } from "@navigation"
import { useTranslations } from "next-intl"

import { Classroom } from "@/types/classroom"

import { cn } from "@/lib/utils"

import { Icons } from "@/components/shared/icons"
import { ScrollArea } from "@/components/ui/scroll-area"

const navigationList = (t: (arg: string) => string) =>
  [
    {
      id: "feed",
      name: t("feed"),
      href: "/feed",
      icon: Icons.home,
      current: true,
    },
    {
      id: "classroom",
      name: t("classroom"),
      href: "/classroom",
      icon: Icons.books,
    },
    {
      id: "dashboard",
      name: t("dashboard"),
      href: "/dashboard",
      icon: Icons.dashboard,
    },
    {
      id: "chat",
      name: t("chat"),
      href: "/chat",
      icon: Icons.messages,
    },
  ] as NavigationList[]

export function FeedNavigationList({
  classrooms,
}: {
  classrooms: Classroom[]
}) {
  const path = usePathname()
  const t = useTranslations("app.components.app.feed-navigation-list")
  const navigation = navigationList(t)

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    path === item.href
                      ? "bg-secondary/80 text-primary"
                      : "text-secondary-foreground/45 hover:bg-secondary hover:text-secondary-foreground",
                    "group flex gap-x-3 rounded-xl p-2 text-sm font-semibold leading-6 transition-all duration-300 hover:bg-secondary-foreground/10"
                  )}
                >
                  {typeof item.icon === "string" ? (
                    <span
                      className={cn(
                        path === item.href
                          ? "text-primary"
                          : "text-secondary-foreground/45",
                        "flex h-6 w-6 shrink-0 items-center justify-center"
                      )}
                      aria-hidden="true"
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={24}
                        height={24}
                      />
                    </span>
                  ) : item.icon ? (
                    <item.icon
                      className={cn(
                        path === item.href
                          ? "text-primary"
                          : "text-secondary-foreground/45",
                        "h-6 w-6 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ) : null}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <div className="text-xs font-semibold leading-6 text-secondary-foreground/50">
            {t("your-classrooms")}
          </div>
          <ul role="list" className="-mx-2 mt-2 space-y-1">
            <ScrollArea className="h-52 sm:h-72">
              <>
                {classrooms.map((classroom) => (
                  <li key={classroom.name}>
                    <Link
                      href={`/classroom/${classroom.id}`}
                      className={cn(
                        path === `/classroom/${classroom.id}`
                          ? "bg-secondary/90 text-primary"
                          : "text-secondary-foreground/60 hover:bg-secondary hover:text-secondary-foreground",
                        "group flex gap-x-3 rounded-xl p-2 text-sm font-semibold leading-6 transition-all duration-300 hover:bg-secondary-foreground/10"
                      )}
                    >
                      {classroom.teacher.user.image &&
                      classroom.teacher.user.image.startsWith(
                        "https://avatars.jakerunzer.com/"
                      ) ? (
                        <span
                          className={cn(
                            path === `/classroom/${classroom.id}`
                              ? "border-primary text-primary"
                              : "group-hover:border-secondary-foreground group-hover:text-secondary-foreground",
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium uppercase"
                          )}
                        >
                          {classroom.name.slice(0, 2)}
                        </span>
                      ) : (
                        classroom.teacher.user.image && (
                          <Image
                            src={classroom.teacher.user.image}
                            alt={classroom.name}
                            width={24}
                            height={24}
                            className={cn(
                              path === `/classroom/${classroom.id}`
                                ? "border-primarytext-primary"
                                : "border-gray-200 text-gray-400 group-hover:border-primary group-hover:text-primary",
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                            )}
                          />
                        )
                      )}

                      <span className="truncate">{classroom.name}</span>
                    </Link>
                  </li>
                ))}
              </>
            </ScrollArea>
          </ul>
        </li>
      </ul>
    </nav>
  )
}
