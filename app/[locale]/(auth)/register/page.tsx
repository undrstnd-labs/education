import { Suspense } from "react"
import { Link } from "@navigation"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"

import { cn, verifyEmail } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/Button"
import { PassCodeAuth } from "@/components/form/PassCodeAuth"
import { UserAuthForm, UserAuthSkeleton } from "@/components/form/UserAuth"
import { LogoPNG } from "@/components/icons/Overall"

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Register")
  return { title: `${t("title")}` }
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const t = useTranslations("Pages.Register")
  const email = searchParams.email as string

  const isEmailValid = verifyEmail(email)

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
          <LogoPNG className="mr-2 h-6 w-6" />
          Undrstnd
        </Link>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo; Kif tjik haja blesh matfalathash &rdquo;
            </p>
            <footer className="text-sm">@findmalek</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <LogoPNG className="mx-auto h-10 w-10" />
          {isEmailValid ? (
            <PassCodeAuth email={email} />
          ) : (
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("registerTitle")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("registerDescription")}
              </p>

              <Suspense fallback={<UserAuthSkeleton />}>
                <UserAuthForm type="register" />
              </Suspense>
            </div>
          )}

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
