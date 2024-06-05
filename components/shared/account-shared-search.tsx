"use client"

import React from "react"
import { usePathname, useRouter } from "@navigation"
import { useTranslations } from "next-intl"

import { Input } from "@/components/ui/input"

export function AccountSharedSearch() {
  const router = useRouter()
  const pathname = usePathname()

  const t = useTranslations("app.components.shared.search-input")

  return (
    <Input
      type="text"
      placeholder={t("placeholder")}
      onChange={(e) => {
        router.push(`${pathname}?search=${e.target.value}`)
        router.refresh()
      }}
    />
  )
}
