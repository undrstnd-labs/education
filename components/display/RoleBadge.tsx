import { cn } from "@lib/utils";
import { useTranslations } from "next-intl";

import { Badge } from "@component/ui/Badge";
import { Icons } from "@component/icons/Lucide";
import { buttonVariants } from "@component/ui/Button";

export function RoleBadge({ role }: { role: string }) {
  const t = useTranslations("Components.Display.RoleBadge");

  return (
    <Badge variant="outline" className="absolute right-2 top-2 font-medium">
      {role === "STUDENT" && (
        <div>
          <Icons.student
            className={cn(
              buttonVariants({ variant: "link", size: "icon" }),
              "h-4 w-4 pr-1 text-muted-foreground"
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
              "h-4 w-4 pr-1 text-muted-foreground"
            )}
          />
          {t("teacher")}
        </div>
      )}
    </Badge>
  );
}
