"use client"

import React from "react"
import { Link, usePathname } from "@navigation"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

import { Separator } from "@/components/ui/separator"

const navigation = (t: (arg: string) => string) => [
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

export function AccountNavigationlist() {
  const path = usePathname()
  const t = useTranslations("app.components.layout.account-navigation-list")

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

      <Separator className="my-2 w-full" />
      <Link
        href="/account/danger-zone"
        className={cn(
          path === "/account/danger-zone"
            ? "bg-destructive/25 text-destructive"
            : "text-destructive hover:bg-destructive-foreground hover:text-destructive",
          "group flex gap-x-3 rounded-xl p-2 text-sm font-semibold leading-6 transition-all duration-300 hover:bg-destructive/10"
        )}
      >
        {t("danger")}
      </Link>
    </nav>
  )
}
