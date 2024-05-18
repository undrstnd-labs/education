"use server"

import { z } from "zod"

import { pinSchema } from "@/config/schema"
import { db } from "@/lib/prisma"

export async function verifyOTPCode(form: z.infer<typeof pinSchema>) {
  const { email, pin } = pinSchema.parse({
    email: form.email,
    pin: form.pin,
  })

  const verificationToken = await db.verificationToken.findFirst({
    where: {
      identifier: email.toLowerCase(),
    },
    orderBy: {
      expires: "asc",
    },
  })

  if (!verificationToken) {
    return {
      status: false,
      url: "",
    }
  }

  return {
    status: pin === verificationToken.passCode,
    url:
      pin === verificationToken.passCode
        ? verificationToken.verificationUrl
        : "",
  }
}

export async function updateVerificationUrl(email: string, url: string) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const verificationToken = await db.verificationToken.findFirst({
    where: {
      identifier: email.toLowerCase(),
    },
    orderBy: {
      expires: "asc",
    },
  })

  if (!verificationToken) {
    return
  }

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
