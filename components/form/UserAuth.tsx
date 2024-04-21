"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { getUserAuthSchema } from "@/config/schema"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

import { buttonVariants } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Skeleton } from "@/components/ui/Skeleton"
import { EmailInput } from "@/components/form/EmailInput"
import { Icons } from "@/components/icons/Lucide"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "login" | "register"
}

export function UserAuthForm({ type, className, ...props }: UserAuthFormProps) {
  const t = useTranslations("Components.Form.UserAuth")
  const userAuthSchema = getUserAuthSchema(
    t("invalidEmail"),
    t("invalidUniversityEmail")
  )
  type FormData = z.infer<typeof userAuthSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      await signIn("email", {
        email: data.email.toLowerCase(),
        redirect: false,
        callbackUrl: searchParams?.get("from") || "/dashboard",
      })
    } catch (error) {
      return toast({
        title: t("toastSignInFailedTitle"),
        description: t("toastSignInFailedDescription"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      router.push(pathname + "?email=" + data.email.toLowerCase())
      return toast({
        title: t("toastSignInSuccessTitle"),
        description: t("toastSignInSuccessDescription"),
      })
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              {t("labelEmail")}
            </Label>

            <EmailInput
              disabled={isLoading || isGitHubLoading}
              placeholder={t("placeholderEmail")}
              register={register}
              {...FormData}
            />

            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {t("buttonForm", { type: type })}{" "}
            <Icons.chevronRight className="ml-2 size-4 stroke-[3px]" />
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("labelChoice")}
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        disabled
        onClick={() => {
          setIsGitHubLoading(true)
          signIn("github", { callbackUrl: "/dashboard" })
        }}
        /*        TODO:  disabled={isLoading || isGitHubLoading}*/
      >
        {isGitHubLoading ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 size-4" />
        )}{" "}
        Github
      </button>
    </div>
  )
}

export function UserAuthSkeleton() {
  return <Skeleton className="h-12 w-[200px]" />
}
