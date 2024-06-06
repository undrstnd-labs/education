import { Classroom as ClassroomPrisma } from "@prisma/client"
import { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export interface MarketingConfig {
  mainNav: MainNavItem[]
}

export type TranslationFunction = (key: string) => string

export type EmailOption = {
  label: string
  abbrev: string
  value: string
  email: string
  phone: string
  avatarUrl: string
}

export type University = {
  label: string
  abbrev: string
  value: string
  email: string
  phone: string
  avatarUrl: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export type customType = {
  changeCount: number
  isForwards: boolean
}

export type NavigationList = {
  id: string
  name: string
  href: string
  icon?: LucideIcon
  image?: string
  current: boolean
}

export type Activity = {
  id: string
  classroom: { name: string; id: string }
  post?: { id: string; name: string }
  type: "post" | "comment"
  user: { name: string; image: string }
  imageUrl: string
  content?: string
  date: string
  comment?: string
}

export type Classroom = ClassroomPrisma & {
  teacher: Teacher & {
    posts: Post[] & {
      user: User
      comments: Comment[] & {}
    }
  }
}
