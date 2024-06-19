"use client"

import { usePathname, useRouter } from "@navigation"
import { useLocale, useTranslations } from "next-intl"

import { locales } from "@/config/locale"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function LanguageSwitch() {
  const local = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("Components.Config.LanguageSwitch")

  function onSelectChange(nextLocale: (typeof locales)[number]) {
    router.push(pathname, { locale: nextLocale })
  }

  return (
    <div className="relative flex items-center">
      <Select defaultValue={local} onValueChange={onSelectChange}>
        <SelectTrigger className="h-[32px] w-full rounded-sm bg-transparent py-1.5 pr-3 text-xs capitalize outline-none ">
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
  )
}
