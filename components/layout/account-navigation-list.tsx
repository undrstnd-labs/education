"use client"

import React from "react"
import { Link, usePathname } from "@navigation"
import { User } from "@prisma/client"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

import { Separator } from "@/components/ui/separator"

const navigationStudent = (t: (arg: string) => string) => [
  {
    id: "profile",
    name: t("profile"),
    href: "/account",
  },
  {
    id: "preference",
    name: t("preference"),
    href: "/account/preference",
  },
  {
    id: "shared",
    name: t("shared"),
    href: "/account/shared",
  },
]

const navigationTeacher = (t: (arg: string) => string) => [
  {
    id: "profile",
    name: t("profile"),
    href: "/account",
  },
  {
    id: "preference",
    name: t("preference"),
    href: "/account/preference",
  },
]

export function AccountNavigationlist({ user }: { user: User }) {
  const path = usePathname()
  const t = useTranslations("app.components.layout.account-navigation-list")
  const navigation =
    user.role === "STUDENT" ? navigationStudent : navigationTeacher

  return (
    <nav className="text-sm text-muted-foreground">
      {navigation(t).map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={cn(
            path === item.href
              ? "bg-secondary/80 text-primary"
              : "text-secondary-foreground/45 hover:bg-secondary hover:text-secondary-foreground",
            "group flex gap-x-3 rounded-xl p-2 text-sm font-semibold leading-6 transition-all duration-300 hover:bg-secondary-foreground/10"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}
