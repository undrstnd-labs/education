"use client"

import { File } from "@prisma/client"
import { useTranslations } from "next-intl"

import { downloadFileFromUrl } from "@/lib/storage"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface FileCardProps {
  file: File
}

export function DownloadFileButton({ file }: FileCardProps) {
  const t = useTranslations("app.components.shared.download-file-button")
  return (
    <DropdownMenuItem
      className="flex items-center gap-2 hover:cursor-pointer"
      onClick={() => downloadFileFromUrl(file.url)}
    >
      {t("download")}
    </DropdownMenuItem>
  )
}
