"use client"

import { Link } from "@navigation"
import { File } from "@prisma/client"
import { useTranslations } from "next-intl"

import { Icons } from "@/components/shared/icons"
import DonloadFileButton from "@/components/showcase/DonloadFileButton"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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

export function FileCard({ file }: FileCardProps) {
  const t = useTranslations("Pages.Classroom")

  return (
    <Card className="mt-2">
      <div className=" group flex flex-col gap-3 p-2">
        <Link
          href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${file.url}`}
        >
          <div
            className="h-[120px] w-full rounded-[20px] bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${
                file.type.startsWith("image/")
                  ? "https://placehold.co/600x230?text=Image"
                  : file.type.includes("application/pdf")
                    ? "https://placehold.co/600x220?text=PDF"
                    : ""
              })`,
            }}
          />
        </Link>
        <div className="flex  items-center justify-between px-2">
          <div className="flex max-w-[80%] flex-col gap-1">
            <Link
              href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${file.url}`}
            >
              <div
                className="truncate text-xs font-semibold text-foreground group-hover:underline
               group-hover:underline-offset-2 hover:underline hover:underline-offset-2 xl:text-sm"
              >
                {file.name}
              </div>
            </Link>
            <div className="text-xs font-medium text-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)}{" "}
              <span className="text-lime-900">MB</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-8 max-sm:size-6"
              >
                <Icons.moreHorizontal className="size-4" />
                <span className="sr-only">Toggle options of File</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("fileOptions")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link
                href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${file.url}`}
              >
                <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer">
                  <Icons.watchFile className="size-4" /> {t("fileCardSeeFile")}
                </DropdownMenuItem>
              </Link>

              <DonloadFileButton file={file} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}
