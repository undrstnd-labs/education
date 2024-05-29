"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "@navigation"
import { Conversation } from "@prisma/client"
import { useTranslations } from "next-intl"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { removeChat } from "@/undrstnd/chat"

export function AccountSharedDeleteFile({ chat }: { chat: Conversation }) {
  const router = useRouter()
  const t = useTranslations("app.pages.shared")

  const handleDelete = async () => {
    await removeChat({ id: chat.id })
    router.refresh()
  }

  return (
    <>
      <DropdownMenuItem
        onClick={() => {
          handleDelete()
        }}
      >
        {t("delete")}
      </DropdownMenuItem>
    </>
  )
}
