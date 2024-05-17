import { unstable_setRequestLocale } from "next-intl/server"

interface AccountLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default function AccountLayout({
  children,
  params: { locale },
}: AccountLayoutProps) {
  unstable_setRequestLocale(locale)

  return <div className="min-h-screen">{children}</div>
}
