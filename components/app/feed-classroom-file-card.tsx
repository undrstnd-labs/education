"use client"

import Image from "next/image"
import { Link } from "@navigation"
import { File } from "@prisma/client"
import { useTranslations } from "next-intl"

import { FeedClassroomOpenChat } from "@/components/app/feed-classroom-open-chat"
import { DownloadFileButton } from "@/components/shared/download-file-button"
import { Icons } from "@/components/shared/icons"
import { PDFPreview } from "@/components/shared/pdf-preview"
import { PDFViewDialogTrigger } from "@/components/shared/pdf-view-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FileCardProps {
  file: File
}

export function FeedClassroomFileCard({ file }: FileCardProps) {
  const t = useTranslations("app.components.app.feed-classroom-file-card")

  return (
    <li
      key={file.id}
      className="relative flex-grow basis-1/3 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
    >
      <Link
        href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${file.url}`}
        target="_blank"
        className="group aspect-h-7 aspect-w-10 block max-w-xs overflow-hidden rounded-lg border bg-gray-100 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-gray-100 sm:max-w-full"
      >
        {file.type === "application/pdf" ? (
          <PDFPreview
            file={{
              ...file,
              url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${file.url}`,
            }}
          />
        ) : (
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${file.url}`}
            alt={file.name}
            className="h-full w-full object-cover"
            width={500}
            height={500}
          />
        )}

        <button type="button" className="absolute inset-0 focus:outline-none">
          <span className="sr-only">View details for {file.name}</span>
        </button>
      </Link>
      <div className="mt-2 flex justify-between">
        <div>
          <p className="pointer-events-none block w-32 truncate text-sm font-medium text-secondary-foreground sm:w-full">
            {file.name.slice(0, 30)}
            {file.name.length > 20 ? "..." : ""}
          </p>

          <p className="pointer-events-none block text-sm font-medium text-secondary-foreground/50">
            {(file.size / (1024 * 1024)).toFixed(1)} MB
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size={"small-icon"} className="ml-auto">
              <Icons.menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{t("more-options")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {file.type === "application/pdf" && (
              <>
                <FeedClassroomOpenChat file={file} />
                <DropdownMenuSeparator />
              </>
            )}

            {file.type === "application/pdf" ? (
              <PDFViewDialogTrigger
                file={{
                  ...file,
                  url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${file.url}`,
                }}
              />
            ) : (
              <DropdownMenuItem asChild>
                <Link
                  target="_blank"
                  href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${file.url}`}
                >
                  {t("view-file")}
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <DownloadFileButton file={file} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  )
}
