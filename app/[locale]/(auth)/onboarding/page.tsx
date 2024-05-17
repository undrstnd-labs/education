import { Link, redirect } from "@navigation"
import { getTranslations } from "next-intl/server"

import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"

import { OnboardingAuthForm } from "@/components/form/OnboardingAuth"
import { LogoPNG } from "@/components/shared/icons"
import { buttonVariants } from "@/components/ui/button"

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Onboarding")
  return { title: `${t("title")}` }
}

export default async function OnboardingPage() {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/login")
  }

  if (user && user.role !== "NOT_ASSIGNED") {
    return redirect("/feed")
  }

  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
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
              &ldquo; Kif tjik haja blesh matfalathash &rdquo;
            </p>
            <footer className="text-sm">@findmalek</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div
            className={cn(
              "relative z-20 flex w-fit items-center text-lg font-semibold"
            )}
          >
            <LogoPNG className="mr-2 size-6" />
            Undrstnd
          </div>
          <OnboardingAuthForm user={user} />
        </div>
      </div>
    </div>
  )
}
