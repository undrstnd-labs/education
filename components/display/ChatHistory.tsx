import React from "react"
import { Link } from "@navigation"
import { Student, User } from "@prisma/client"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

import { SidebarList } from "@/components/display/SidebarList"
import { Icons } from "@/components/icons/Lucide"
import { buttonVariants } from "@/components/ui/Button"

export function ChatHistory({
  student,
}: {
  student: Student & { user: User }
}) {
  const t = useTranslations("Components.Display.ChatHistory")

  return (
    <div className="flex max-h-[750px] flex-col">
      <div className="my-4 px-2">
        <Link
          href="/chat"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10"
          )}
        >
          <Icons.add className="-translate-x-2 stroke-2" />
          {t("newChat")}
        </Link>
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-1 flex-col space-y-4 overflow-auto px-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-full shrink-0 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        <SidebarList student={student} />
      </React.Suspense>
    </div>
  )
}
