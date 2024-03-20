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

      console.log(magicObj.verification_token);
      console.log(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/email?callbackUrl=${process.env.NEXT_PUBLIC_URL}&token=${magicObj.verification_token.token}&email=${data.email}`
      );

      if (magicObj.verification_token.passCode != data.pin) {
        throw new Error("Invalid passCode");
      }

      // FIXME: This is a temporary solution and it dosent work
      //http://localhost:3000/api/auth/callback/email?allbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fdashboard&token=9118351b6a81b02f2dbde6f32fac70ec7a5361956b61fe35f1b3d68415b51507&email=fdfsdfdsfdsf%40ensi.rnu.tn
      router.push(
        `/api/auth/callback/email?callbackUrl=${process.env.NEXT_PUBLIC_URL}&token=${magicObj.verification_token.token}&email=${data.email}`
      );
    } catch (error: any) {
      setLoading(false);
      // TODO: Translate error message
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
