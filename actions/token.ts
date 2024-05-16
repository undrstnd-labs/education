"use server"

import { z } from "zod"

import { pinSchema } from "@/config/schema"
import { db } from "@/lib/prisma"

export async function verifyOTPCode(form: z.infer<typeof pinSchema>) {
  const { email, pin } = pinSchema.parse({
    email: form.email,
    pin: form.pin,
  })

  const verificationTokens = await db.verificationToken.findMany({
    where: {
      identifier: email.toLowerCase(),
    },
    orderBy: {
      expires: "desc",
    },
  })

  const verificationToken = verificationTokens[0]

  return {
    status: pin === verificationToken.passCode,
    url:
      pin === verificationToken.passCode
        ? verificationToken.verificationUrl
        : "",
  }
}

export async function updateVerificationUrl(email: string, url: string) {
  const verificationTokens = await db.verificationToken.findMany({
    where: {
      identifier: email.toLowerCase(),
    },
    orderBy: {
      expires: "desc",
    },
  })

  const verificationToken = verificationTokens[0]
  const passCode = Math.floor(100000 + Math.random() * 900000).toString()

  await db.verificationToken.update({
    where: {
      token: verificationToken.token,
      identifier: email.toLowerCase(),
    },
    data: {
      passCode,
      verificationUrl: url,
    },
  })

  return passCode
}
