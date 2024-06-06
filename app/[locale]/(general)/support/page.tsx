import { unstable_setRequestLocale } from "next-intl/server"

export default function SupportPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)

  return <h1>This is the Support Page</h1>
}
