"use client"

import React from "react"
import { File } from "@prisma/client"
import { useTranslations } from "next-intl"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function FeedClassroomOpenChat({ file }: { file: File }) {
  const t = useTranslations("app.components.app.feed-classroom-open-chat")

  return (
    <DropdownMenuItem
      className="flex items-center gap-2 hover:cursor-pointer"
      onClick={() => console.log("Open chat")}
    >
      {t("open-chat")}
    </DropdownMenuItem>
  )
}
