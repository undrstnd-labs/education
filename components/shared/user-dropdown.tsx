import { Link } from "@navigation"
import { useTranslations } from "next-intl"

import { StatusWidget } from "@/components/display/StatusWidget"
import { LanguageSwitch } from "@/components/shared/language-switch"
import { ThemeSwitch } from "@/components/shared/theme-switch"
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function UserDropdown() {
  const t = useTranslations("Components.Showcase.UserDropdown")

  return (
    <div>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Link href="/account" className="w-full">
          {t("account")}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <div className="flex flex-row items-center justify-between px-2 py-0.5">
        <p className="text-sm">{t("theme")}</p>
        <ThemeSwitch />
      </div>
      <div className="flex flex-row items-center justify-between px-2 py-0.5">
        <p className="text-sm">{t("language")}</p>
        <LanguageSwitch />
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <StatusWidget />
      </DropdownMenuItem>
      <DropdownMenuSeparator />
    </div>
  )
}
