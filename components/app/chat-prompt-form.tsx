import * as React from "react"
import { usePathname, useRouter } from "@navigation"
import { UseChatHelpers } from "ai/react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { useEnterSubmit } from "@/hooks/use-enter-submit"

import { ChatUploadFile } from "@/components/app/chat-upload-file"
import { Icons } from "@/components/shared/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => void
  isLoading: boolean
  id: string
  studentId: string
}

function ActionButton({ onClick, icon, label }: any) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              buttonVariants({ size: "icon", variant: "outline" }),
              "absolute left-0 top-3 size-4 rounded-full bg-background p-0 sm:left-4"
            )}
          >
            {icon}
            <span className="sr-only">{label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function ChatPromptForm({
  onSubmit,
  id,
  studentId,
  input,
  setInput,
  isLoading,
}: PromptProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const { formRef, onKeyDown } = useEnterSubmit()
  const t = useTranslations("Components.Form.Prompt")
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const isChatPath = pathname.includes("/chat/c/")

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput("")
        onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <ActionButton
          onClick={() => {
            if (isChatPath) {
              router.push("/chat/")
            } else {
              setOpen(true)
            }
          }}
          icon={
            isChatPath ? (
              <Icons.add className="size-4 rounded-full" />
            ) : (
              <Icons.upload className="size-4 rounded-full" />
            )
          }
          label={isChatPath ? t("new-chat") : t("upload-file")}
        />

        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          maxRows={8}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("send-message") + "..."}
          spellCheck={false}
          className="min-h-[60px] w-full resize-none border-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-3 sm:right-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || input === ""}
                >
                  <Icons.enter />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("send-message")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <ChatUploadFile
        open={open}
        setOpen={setOpen}
        id={id}
        studentId={studentId}
      />
    </form>
  )
}
