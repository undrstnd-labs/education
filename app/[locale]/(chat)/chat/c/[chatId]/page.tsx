import { type Metadata } from "next"
import { redirect } from "@navigation"
import { Student, User } from "@prisma/client"

import { getChat } from "@/lib/actions"
import { getCurrentStudent, getCurrentUser } from "@/lib/session"
import { getFormattedChat } from "@/lib/utils"

import { Chat } from "@/components/display/Chat"

export interface ChatPageProps {
  params: {
    chatId: string
  }
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const user = await getCurrentUser()

  const student = (await getCurrentStudent(user!.id)) as Student & {
    user: User
  }

  const chat = await getChat(params.chatId, student.id)
  return {
    title: `${chat?.title.toString().slice(0, 50)} | Undrstnd` ?? "Chat",
  }
}

export default async function ChatPage({
  params,
}: {
  params: { chatId: string }
}) {
  const user = await getCurrentUser()

  const student = (await getCurrentStudent(user!.id)) as Student & {
    user: User
  }

  const chat = await getFormattedChat(params.chatId, student.id)

  if (!chat || !chat.id) {
    redirect("/chat")
    return null
  }

  if (chat?.studentId && chat.studentId !== student.id) {
    redirect("/chat")
    return null
  }

  // @ts-ignore: initialMessages is not null
  return <Chat id={chat.id} student={student} initialMessages={chat.messages} />
}
