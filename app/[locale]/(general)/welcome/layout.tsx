import { unstable_setRequestLocale } from "next-intl/server"

export default function RootLayout({
  params: { locale },
  children,
}: {
  params: { locale: string }
  children: React.ReactNode
}) {
  unstable_setRequestLocale(locale)

  return (
    <div className="bg-hero-pattern -mt-20 bg-neutral-100 bg-cover bg-top bg-no-repeat pb-20 antialiased">
      {children}
    </div>
  )
}
