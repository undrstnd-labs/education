"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@navigation"
import { signIn } from "next-auth/react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { getUserAuthSchema } from "@/config/schema"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

import { AuthInputUniversityForm } from "@/components/app/auth-input-university-form"
import { Icons } from "@/components/shared/icons"
import { buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "login" | "register"
}

export function AuthUserEmail({
  type,
  className,
  ...props
}: UserAuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)

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
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    try {
      await signIn("email", {
        email: data.email.toLowerCase(),
        redirect: false,
        callbackUrl: "/feed",
      })

      router.push("/otp-code/" + data.email.toLowerCase())
      return toast({
        title: t("toastSignInSuccessTitle"),
        description: t("toastSignInSuccessDescription"),
      })
    } catch (error) {
      return toast({
        title: t("toastSignInFailedTitle"),
        description: t("toastSignInFailedDescription"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

            <AuthInputUniversityForm
              disabled={isLoading || isGitHubLoading}
              placeholder={t("placeholderEmail")}
              register={register}
              setValue={setValue}
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
        onClick={() => {
          setIsGitHubLoading(true)
          signIn("github", { callbackUrl: "/onboarding" })
        }}
        disabled={isLoading || isGitHubLoading}
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
