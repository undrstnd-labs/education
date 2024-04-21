import { Suspense } from "react"
import { Link } from "@navigation"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"

import { cn, verifyEmail } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/Button"
import { PassCodeAuth } from "@/components/form/PassCodeAuth"
import { UserAuthForm, UserAuthSkeleton } from "@/components/form/UserAuth"
import { Icons } from "@/components/icons/Lucide"
import { LogoPNG } from "@/components/icons/Overall"

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Login")
  return { title: `${t("title")}` }
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const t = useTranslations("Pages.Login")
  const email = searchParams.email as string

  const isEmailValid = verifyEmail(email)

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        {t("buttonBack")}
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <LogoPNG className="mx-auto h-10 w-10" />
        {isEmailValid ? (
          <PassCodeAuth email={email} />
        ) : (
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("loginTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("loginDescription")}
            </p>

            <Suspense fallback={<UserAuthSkeleton />}>
              <UserAuthForm type="login" />
            </Suspense>
          </div>
        )}

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
