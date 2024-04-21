import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"

import { locales } from "@/config/locale"

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound()

  return {
    messages: (await import(`@/data/locale/${locale}.json`)).default,
  }
})
