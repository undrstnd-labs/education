import { Link } from "@navigation"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { cn } from "@/lib/utils"

import { AuthUserEmail } from "@/components/app/auth-user-email"
import { LogoPNG } from "@/components/shared/icons"
import { buttonVariants } from "@/components/ui/button"

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Register")
  return { title: `${t("title")}` }
}

export default async function RegisterPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)

  const t = await getTranslations("Pages.Register")
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        {t("buttonConnection")}
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 dark:border-r lg:flex">
        <div className="bg-white-900 absolute inset-0" />
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "relative z-20 flex w-fit items-center text-lg font-semibold"
          )}
        >
          <LogoPNG className="mr-2 size-6" />
          Undrstnd
        </Link>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo; Understand better with Undrstnd &rdquo;
            </p>
            <footer className="text-sm">@mohamed-amine-jguirim</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <LogoPNG className="mx-auto size-10" />

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("registerTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("registerDescription")}
            </p>

            <AuthUserEmail type="register" />
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            {t("labelAccept")}{" "}
            <Link
              href="/about/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              {t("labelConditions")}
            </Link>{" "}
            {t("labelAnd")}{" "}
            <Link
              href="/about/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              {t("labelPolicy")}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
