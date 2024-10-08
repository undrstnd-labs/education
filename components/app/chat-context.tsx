"use client"

import { usePathname, useRouter } from "@navigation"
import { Student, User } from "@prisma/client"
import { useChat, type Message } from "ai/react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { useScrollAnchor } from "@/hooks/use-scroll-anchor"
import { toast } from "@/hooks/use-toast"

import { ChatEmptyScreen } from "@/components/app/chat-empty-screen"
import { ChatList } from "@/components/app/chat-list"
import { ChatPanel } from "@/components/app/chat-panel"

export interface ChatProps {
  id: string
  student: Student & { user: User }
  initialMessages?: Message[]
}

export function ChatContext({ id, initialMessages, student }: ChatProps) {
  const path = usePathname()
  const router = useRouter()
  const t = useTranslations("app")

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        studentId: student.id,
        lang: t("lang"),
      },
      onFinish() {
        if (path === "/chat") {
          router.push(`/chat/c/${id}`)
          router.refresh()
        }
      },
      onError(error) {
        toast({
          title: error.message,
          description: error.stack,
          variant: "destructive",
        })

        router.refresh()
      },
    })

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div className={cn("overflow-x-hidden pb-20 pt-20")} ref={messagesRef}>
        {messages.length ? (
          <ChatList messages={messages} student={student} />
        ) : (
          <ChatEmptyScreen setInput={setInput} />
        )}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        studentId={student.id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  )
}
