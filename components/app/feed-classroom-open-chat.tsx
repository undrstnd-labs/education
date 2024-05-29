"use client"

import React from "react"
import { useRouter } from "@navigation"
import { File } from "@prisma/client"
import { useTranslations } from "next-intl"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { saveChat } from "@/undrstnd/chat"

export function FeedClassroomOpenChat({
  file,
  studentId,
}: {
  file: File
  studentId: string
}) {
  const router = useRouter()

  const t = useTranslations("app.components.app.feed-classroom-open-chat")

  return (
    <DropdownMenuItem
      className="flex items-center gap-2 hover:cursor-pointer"
      onClick={async () => {
        await saveChat(file.id, studentId, file, `/chat/c/${file.id}`)
        router.push(`/chat/c/${file.id}`)
        router.refresh()
      }}
    >
      {t("open-chat")}
    </DropdownMenuItem>
  )
}
