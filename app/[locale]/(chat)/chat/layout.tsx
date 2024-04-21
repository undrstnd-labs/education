import { redirect } from "@navigation"
import { Student, User } from "@prisma/client"
import { getTranslations } from "next-intl/server"

import { NextAuthUser } from "@/types/auth"

import {
  getCurrentStudent,
  getCurrentUser,
  userAuthentificateVerification,
} from "@/lib/session"
import { SidebarProvider } from "@/hooks/use-sidebar"

import { Header } from "@/components/navigation/ChatHeader"
import { SidebarDesktop } from "@/components/navigation/SidebarDesktop"

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Chat")
  return { title: `${t("title")}` }
}

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  const user = await getCurrentUser()

  const toRedirect = await userAuthentificateVerification(
    user as NextAuthUser,
    "STUDENT"
  )

  if (toRedirect) {
    redirect(toRedirect)
  }

  if (!user) {
    return null
  }

  const student = (await getCurrentStudent(user.id)) as Student & {
    user: User
  }

  return (
    <SidebarProvider>
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
        <Header />
        <SidebarDesktop student={student} />
        <div className="group w-full overflow-auto pl-0 duration-300 ease-in-out animate-in peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}
