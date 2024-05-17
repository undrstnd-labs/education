import React from "react"
import { type Metadata } from "next"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.pages.danger-zone")
  return {
    title: `${t("metadata-title")}`,
  }
}

export default function DangerZonePage() {
  return <div>DangerZonePage</div>
}
