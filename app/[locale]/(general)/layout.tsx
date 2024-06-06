import { unstable_setRequestLocale } from "next-intl/server"

import Header from "@/components/navigation/Header"

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
      <Header />
      {children}
    </main>
  )
}
