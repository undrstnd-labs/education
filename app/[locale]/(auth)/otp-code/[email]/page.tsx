import { Link, redirect } from "@navigation"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { cn, verifyEmail } from "@/lib/utils"

import { AuthOTPCode } from "@/components/app/auth-otp-code"
import { Icons, LogoPNG } from "@/components/shared/icons"
import { buttonVariants } from "@/components/ui/button"

export default async function OTPCodePage({
  params: { email, locale },
}: {
  params: { email: string; locale: string }
}) {
  unstable_setRequestLocale(locale)

  const t = await getTranslations("app.pages.otp-code")

  if (!verifyEmail(decodeURIComponent(email))) {
    return redirect("/login")
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <Icons.chevronLeft className="mr-2 size-4" />
        {t("button-back")}
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <LogoPNG className="mx-auto size-10" />
        <AuthOTPCode email={decodeURIComponent(email)} />
      </div>
    </div>
  )
}
