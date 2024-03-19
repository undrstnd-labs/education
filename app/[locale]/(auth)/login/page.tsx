import { Metadata } from "next";
import { Suspense } from "react";
import { Link } from "@lib/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { Icons } from "@component/icons/Lucide";
import { LogoPNG } from "@component/icons/Overall";

import { buttonVariants } from "@component/ui/Button";
import { UserAuthForm, UserAuthSkeleton } from "@component/form/UserAuth";

export const metadata: Metadata = {
  title: "Se connecter à votre compte",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = useTranslations("Pages.Login");


/*   const fetchPasscode = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/auth/token/${identifier}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json()); */

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
        <div className="flex flex-col space-y-2 text-center">
          <LogoPNG className="mx-auto h-10 w-10" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("loginTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("loginDescription")}
          </p>
        </div>

        <Suspense fallback={<UserAuthSkeleton />}>
          {searchParams.email ? <>fgds</> : <UserAuthForm type="login" />}
        </Suspense>

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
  );
}
