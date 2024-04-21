"use client"

import { File } from "@prisma/client"
import { useTranslations } from "next-intl"

import { downloadFileFromUrl } from "@/lib/storage"

import { Icons } from "../icons/Lucide"
import { DropdownMenuItem } from "../ui/DropdownMenu"

interface FileCardProps {
  file: File
}

const DonloadFileButton = ({ file }: FileCardProps) => {
  const t = useTranslations("Pages.Classroom")
  return (
    <DropdownMenuItem
      className="flex items-center gap-2 hover:cursor-pointer"
      onClick={() => downloadFileFromUrl(file.url)}
    >
      <Icons.downloadFile className="h-4 w-4" /> {t("downloadFile")}
    </DropdownMenuItem>
  )
}

export default DonloadFileButton
