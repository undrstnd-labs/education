"use server";

import { z } from "zod";
import { TokenType } from "@/types/auth";
import { pinSchema } from "@config/schema";

export async function verifyPassCode(form: z.infer<typeof pinSchema>) {
  const data = pinSchema.parse({
    email: form.email,
    pin: form.pin,
  });

  const fetchToken = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/token/${data.email}`
  ).then((res) => res.json());

  return {
    success: true,
    verification_token: fetchToken as TokenType,
  };
}
