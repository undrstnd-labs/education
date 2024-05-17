import { type Metadata } from "next"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { redirect } from "@/lib/navigation"
import { getCurrentUser } from "@/lib/session"

import { AccountBioForm } from "@/components/app/account-bio-form"
import { AccountNameForm } from "@/components/app/account-name-form"
import { AccountProfileForm } from "@/components/app/account-profile-form"
import Profile from "@/components/form/Profile"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
          <CardTitle>{t("profile-pic-title")}</CardTitle>
          <CardDescription>{t("profile-pic-description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountProfileForm user={user} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile-name-title")}</CardTitle>
          <CardDescription>{t("profile-name-description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountNameForm />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>{t("save")}</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile-bio-title")}</CardTitle>
          <CardDescription>{t("profile-bio-description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountBioForm />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>{t("save")}</Button>
        </CardFooter>
      </Card>
    </main>
  )
}
