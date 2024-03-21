"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@component/ui/Form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@component/ui/InputOTP";

import { toast } from "@hook/use-toast";
import { pinSchema } from "@config/schema";
import { verifyPassCode } from "@lib/actions";

function OTPform({ email }: { email: string }) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslations("Components.Form.PassCodeAuth");
  const form = useForm<z.infer<typeof pinSchema>>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      email,
    },
  });

  async function onSubmit(data: z.infer<typeof pinSchema>) {
    setLoading(true);

    try {
      const magicObj = await verifyPassCode(data);

      if (magicObj.verification_token.passCode != data.pin) {
        throw new Error("Invalid passCode");
      }

      router.push(magicObj.verification_token.verificationUrl);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: t("error"),
        description: t("try-again"),
        variant: "destructive",
      });
    }
  }

  const handleOTPChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      form.setValue("pin", value);
      form.handleSubmit(onSubmit)();
    }
  };

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
  );
}

export function PassCodeAuth({ email }: { email: string }) {
  const t = useTranslations("Components.Form.PassCodeAuth");

  return (
    <div className="flex flex-col space-y-6 justify-center items-center text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("verify-account")}
      </h1>
      <p className="text-sm text-muted-foreground">
        {t("verify-account-description")}
      </p>
      <OTPform email={email} />
    </div>
  );
}
