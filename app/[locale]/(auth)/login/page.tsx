import { Link } from "@navigation"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { cn } from "@/lib/utils"

import { AuthUserEmail } from "@/components/app/auth-user-email"
import { Icons, LogoPNG } from "@/components/shared/icons"
import { buttonVariants } from "@/components/ui/button"

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Login")
  return { title: `${t("title")}` }
}

export default async function LoginPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)
  const t = await getTranslations("Pages.Login")

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <Icons.chevronLeft className="mr-2 size-4" />
        {t("buttonBack")}
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <LogoPNG className="mx-auto size-10" />

        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("loginTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("loginDescription")}
          </p>

          <AuthUserEmail type="login" />
        </div>

        <p className="px-8 text-center text-sm text-muted-foreground">
          {t("labelNew")}{" "}
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            {t("labelCreateAccount")}
          </Link>
        </p>
      </div>
    </div>
  )
}
