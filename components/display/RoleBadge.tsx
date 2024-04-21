import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/Badge"
import { buttonVariants } from "@/components/ui/Button"
import { Icons } from "@/components/icons/Lucide"

export function RoleBadge({ role }: { role: string }) {
  const t = useTranslations("Components.Display.RoleBadge")

  return (
    <Badge variant="outline" className="absolute right-2 top-2 font-medium">
      {role === "STUDENT" && (
        <div>
          <Icons.student
            className={cn(
              buttonVariants({ variant: "link", size: "icon" }),
              "size-4 pr-1 text-muted-foreground"
            )}
          />
          {t("student")}
        </div>
      )}
      {role === "TEACHER" && (
        <div>
          <Icons.teacher
            className={cn(
              buttonVariants({ variant: "link", size: "icon" }),
              "size-4 pr-1 text-muted-foreground"
            )}
          />
          {t("teacher")}
        </div>
      )}
    </Badge>
  )
}
