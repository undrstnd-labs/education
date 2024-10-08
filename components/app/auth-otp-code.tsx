"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { authOTPCodeTranslatedSchema } from "@/config/schema"
import { toast } from "@/hooks/use-toast"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { verifyOTPCode } from "@/undrstnd/token"

function OTPform({ email }: { email: string }) {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState<boolean>(false)

  const t = useTranslations("app.components.app.auth-otp-code")
  const OTPCodeSchema = authOTPCodeTranslatedSchema(t)

  const form = useForm<z.infer<typeof OTPCodeSchema>>({
    resolver: zodResolver(OTPCodeSchema),
    defaultValues: {
      email,
    },
  })

  async function onSubmit(data: z.infer<typeof OTPCodeSchema>) {
    setLoading(true)

    try {
      const auth = await verifyOTPCode(data)

      if (auth.status === false || !auth.url) {
        throw new Error("Invalid passCode")
      }

      router.push(auth.url)
    } catch (error: any) {
      setLoading(false)
      toast({
        title: t("toast-error"),
        variant: "destructive",
      })
    }
  }

  const handleOTPChange = (value: string) => {
    setOtp(value)
    if (value.length === 6) {
      form.setValue("pin", value)
      form.handleSubmit(onSubmit)()
    }
  }

  return (
    <Form {...form}>
      <form className="px-10">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  value={otp}
                  onChange={handleOTPChange}
                  disabled={loading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className="w-full">
                {t("email-sent")} <span className="font-semibold">{email}</span>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export function AuthOTPCode({ email }: { email: string }) {
  const t = useTranslations("app.components.app.auth-otp-code")

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("verify-account")}
      </h1>
      <p className="text-sm text-muted-foreground">
        {t("verify-account-description")}
      </p>
      <OTPform email={email} />
    </div>
  )
}
