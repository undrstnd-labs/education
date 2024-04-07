import { Link } from "@lib/navigation";
import { useTranslations } from "next-intl";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@component/ui/DropdownMenu";
import { ThemeSwitch } from "@component/config/ThemeSwitch";
import { StatusWidget } from "@component/display/StatusWidget";
import { LanguageSwitch } from "../config/LanguageSwitch";

export function UserDropdown() {
  const t = useTranslations("Components.Showcase.UserDropdown");
  return (
    <div>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Link href="/account" className="w-full">
          {t("account")}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/account/classrooms" className="w-full">
          {t("classrooms")}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <div className="flex flex-row justify-between items-center p-2">
        <p className="text-sm">{t("theme")}</p>
        <ThemeSwitch />
      </div>
      <DropdownMenuSeparator />
      <div className="flex flex-row justify-between items-center p-2">
        <p className="text-sm">{t("language")}</p>
        <LanguageSwitch />
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <StatusWidget />
      </DropdownMenuItem>
      <DropdownMenuSeparator />
    </div>
  );
}
