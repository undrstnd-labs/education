import { type Metadata } from "next"
import { redirect } from "@navigation"
import { Student, User } from "@prisma/client"
import { type Message } from "ai/react"

import { getCurrentStudent, getCurrentUser } from "@/lib/session"

import { ChatContext } from "@/components/app/chat-context"
import { ChatPDFRender } from "@/components/app/chat-pdf-render"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import { getChat } from "@/undrstnd/chat"

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

async function getFormattedChat(chatId: string, studentId: string) {
  const chat = await getChat(chatId, studentId)

  const newChat = {
    ...chat,
    messages: chat!.messages.map((message: { role: string }) => {
      if (message.role === "USER") {
        return { ...message, role: "user" as Message["role"] }
      } else if (message.role === "AI") {
        return { ...message, role: "assistant" as Message["role"] }
      } else {
        return { ...message, role: "assistant" as Message["role"] }
      }
    }),
  }

  return newChat
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

  if (!chat.file) {
    return (
      <ChatContext
        id={chat.id}
        student={student}
        // @ts-ignore: initialMessages is not null
        initialMessages={chat.messages}
      />
    )
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={18} minSize={38} className="px-2">
        {/* @ts-ignore: chat is not null */}
        <ChatPDFRender file={chat.file} student={student} chat={chat} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={82}
        minSize={40}
        style={{ height: "80vh", overflowY: "auto" }}
      >
        <ChatContext
          id={chat.id}
          student={student}
          // @ts-ignore: initialMessages is not null
          initialMessages={chat.messages}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
