"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@component/ui/Select";
import { usePathname, useRouter } from "@lib/navigation";
import { useLocale, useTranslations } from "next-intl";
import { locales } from "@/config/locale";

export function LanguageSwitch() {
  const t = useTranslations("Components.Config.LanguageSwitch");
  const router = useRouter();
  const pathname = usePathname();
  const local = useLocale();

  function onSelectChange(nextLocale: string) {
    router.push(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex items-center relative">
      <Select defaultValue={local} onValueChange={onSelectChange}>
        <SelectTrigger className="w-full pr-3 py-1.5 bg-transparent outline-none capitalize h-[32px] text-xs rounded-sm ">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {locales.map((locale) => (
              <SelectItem key={locale} value={locale} className="capitalize">
                {t("locale", { locale: locale })}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
