import * as React from "react"
import { type UseChatHelpers } from "ai/react"
import { useTranslations } from "next-intl"

import { ChatPromptForm } from "@/components/app/chat-prompt-form"
import { Icons } from "@/components/shared/icons"
import { Button, ButtonScrollToBottom } from "@/components/ui/button"

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id: string
  studentId: string
  title?: string
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  studentId,
  title,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  isAtBottom,
  scrollToBottom,
}: ChatPanelProps) {
  const t = useTranslations("Components.Form.ChatPanel")

  return (
    <div className="fixed inset-x-0 bottom-0 w-full duration-300 ease-in-out animate-in  peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-12 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <Icons.stop className="mr-2 size-5 stroke-[1.25]" />
              {t("stop-generating")}
            </Button>
          ) : (
            messages?.length >= 2 && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => reload()}>
                  <Icons.refresh className="mr-2 size-5 stroke-[1.25]" />
                  {t("regenerate")}
                </Button>
              </div>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <ChatPromptForm
            onSubmit={async (value: string) => {
              await append({
                id,
                content: value,
                role: "user",
              })
            }}
            id={id}
            studentId={studentId}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
