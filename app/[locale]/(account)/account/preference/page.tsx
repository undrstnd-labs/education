import { type Metadata } from "next"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.pages.preference")
  return {
    title: `${t("metadata-title")}`,
  }
}

export default function PreferencePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)

  return <>Preference</>
}
