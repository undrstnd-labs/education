"use client"

import { signOut } from "next-auth/react"
import { useTranslations } from "next-intl"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function SignoutButton() {
  const t = useTranslations("Components.Showcase.UserDropdown")

  return (
    <DropdownMenuItem
      className="cursor-pointer text-red-600"
      onClick={() => {
        signOut()
      }}
    >
      {t("logout")}
    </DropdownMenuItem>
  )
}
