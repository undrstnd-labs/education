import { getTranslations } from "next-intl/server";

import { cn } from "@lib/utils";
import { getCurrentUser } from "@lib/session";
import { Link, redirect } from "@lib/navigation";

import { LogoPNG } from "@component/icons/Overall";
import { buttonVariants } from "@/components/ui/Button";
import { OnboardingAuthForm } from "@component/form/OnboardingAuth";

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Onboarding");
  return { title: `${t("title")}` };
}

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
    return null;
  }

  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
        <div className="absolute inset-0 bg-white-900" />
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "relative z-20 flex items-center text-lg font-semibold w-fit"
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
          <div
            className={cn(
              "relative z-20 flex items-center text-lg font-semibold w-fit"
            )}
          >
            <LogoPNG className="mr-2 h-6 w-6" />
            Undrstnd
          </div>
          <OnboardingAuthForm user={user} />
        </div>
      </div>
    </div>
  );
}
