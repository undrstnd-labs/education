import { type Metadata } from "next"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { LanguageSwitch } from "@/components/shared/language-switch"
import { ThemeSwitch } from "@/components/shared/theme-switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.pages.preference")
  return {
    title: `${t("metadata-title")}`,
  }
}

export default async function PreferencePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations("app.pages.preference")

  return (
    <main className="flex flex-col gap-4 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("theme")}</CardTitle>
          <CardDescription>{t("theme-description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSwitch />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("language")}</CardTitle>
          <CardDescription>{t("language-description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LanguageSwitch />
        </CardContent>
      </Card>
    </main>
  )
}
