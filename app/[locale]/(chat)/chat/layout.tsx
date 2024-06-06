import { redirect } from "@navigation"
import { Student, User } from "@prisma/client"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { getCurrentStudent } from "@/lib/session"

import { ChatHeader } from "@/components/layout/chat-header"
import { ChatSidebarDesktop } from "@/components/layout/chat-sidebar-desktop"

import "simplebar-react/dist/simplebar.min.css"

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Chat")
  return { title: `${t("title")}` }
}

interface ChatLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default async function ChatLayout({
  children,
  params: { locale },
}: ChatLayoutProps) {
  unstable_setRequestLocale(locale)

  const student = (await getCurrentStudent()) as Student & {
    user: User
  }

  if (!student) {
    redirect("/feed")
  }

  return (
    <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
      <ChatHeader student={student} />
      <ChatSidebarDesktop student={student} />
      <div className="group w-full overflow-auto pl-0 duration-300 ease-in-out animate-in peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
        {children}
      </div>
    </div>
  )
}
