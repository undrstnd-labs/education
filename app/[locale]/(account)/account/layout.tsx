import { Link } from "@navigation"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { AccountNavigationlist } from "@/components/layout/account-navigation-list"
import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"

interface AccountLayoutProps {
  params: { locale: string }
  children: React.ReactNode
}

export default async function AccountLayout({
  children,
  params: { locale },
}: AccountLayoutProps) {
  unstable_setRequestLocale(locale)

  const t = await getTranslations("app.pages.account")

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-3xl font-semibold">{t("account")}</h1>
            <Link href="/feed">
              <Button variant="secondary" size={"sm"}>
                {t("back")}
                <Icons.chevronRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <AccountNavigationlist />
          <div>{children}</div>
        </div>
      </main>
    </div>
  )
}
