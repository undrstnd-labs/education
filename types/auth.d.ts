import { User } from "@prisma/client"
import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

export type MagicLinkData = {
  email: string
  otp_link: string
  passCode: string
}

declare module "next-auth" {
  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  type JWT = User
}

export type EmailSelectProps = {
  disabled?: boolean
  value: string
  onSelect: (value: string) => void
  options: EmalSelectOption[]
}

export type TokenType = {
  identifier: string
  token: string
  expires: string
  passCode: string
  verificationUrl: string
}

export type UserType = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: "NOT_ASSIGNED" | "STUDENT" | "TEACHER"
  emailVerified: Date | null
  createdAt: Date | null
  updatedAt: Date | null
}

export interface NextAuthUser extends User {
  role: string
}
