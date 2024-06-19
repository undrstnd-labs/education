import { unstable_setRequestLocale } from "next-intl/server"

import { GeneralFooter } from "@/components/layout/general-footer"
import { GeneralHeader } from "@/components/layout/general-header"

export default function RootLayout({
  params: { locale },
  children,
}: {
  params: { locale: string }
  children: React.ReactNode
}) {
  unstable_setRequestLocale(locale)
  return (
    <main>
      <GeneralHeader />
      {children}
      <GeneralFooter />
    </main>
  )
}
