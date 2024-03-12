import Link from "next/link";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

import { LogoPNG } from "@component/icons/Overall";
import { buttonVariants } from "@component/ui/Button";
import { UserAuthForm, UserAuthSkeleton } from "@component/form/UserAuth";

export const metadata = {
  title: "Créer votre compte",
};

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        Se connecter
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
        <div className="absolute inset-0 bg-white-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <LogoPNG className="mr-2 h-6 w-6" />
          Undrstnd
        </div>
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
          <div className="flex flex-col space-y-2 text-center">
            <LogoPNG className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Créer votre compte
            </h1>
            <p className="text-sm text-muted-foreground">
              Saisissez votre email ci-dessous pour vous inscrire
            </p>
          </div>
          <Suspense fallback={<UserAuthSkeleton />}>
            <UserAuthForm />
          </Suspense>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Lors de la création de votre compte, vous acceptez nos{" "}
            <Link
              href="/about/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Conditions d'utilisation
            </Link>{" "}
            et{" "}
            <Link
              href="/about/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              Politique de confidentialité
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
