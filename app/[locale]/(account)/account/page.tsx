import { type Metadata } from "next"
import { redirect } from "@navigation"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { getCurrentUser } from "@/lib/session"

import { AccountDeleteProfile } from "@/components/app/account-delete-profile"
import { AccountProfileForm } from "@/components/app/account-profile-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app.pages.account")
  return {
    title: `${t("metadata-title")}`,
  }
}

export default async function AccountPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations("app.pages.account")

  const user = await getCurrentUser()

  if (!user || !user.name || !user.email || !user.image || !user.bio) {
    return redirect("/login")
  }

  return (
    <main className="flex flex-col gap-4 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("profile-title")}</CardTitle>
          <CardDescription>{t("profile-description")}</CardDescription>
        </CardHeader>
        <CardContent className="border-t">
          <AccountProfileForm user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("danger-zone-title")}</CardTitle>
          <CardDescription>{t("danger-zone-description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountDeleteProfile user={user} />
        </CardContent>
      </Card>
    </main>
  )
}
