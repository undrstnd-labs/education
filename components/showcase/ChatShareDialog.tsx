"use client"

import * as React from "react"
import { ServerActionResult } from "@/types"
import { type DialogProps } from "@radix-ui/react-dialog"
import { useTranslations } from "next-intl"

import { type Chat } from "@/types/chat"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { toast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { IconSpinner } from "@/components/icons/Overall"

interface ChatShareDialogProps extends DialogProps {
  chat: Pick<Chat, "id" | "title" | "messages">
  shareChat: (id: string) => ServerActionResult<Chat>
  onCopy: () => void
}

export function ChatShareDialog({
  chat,
  shareChat,
  onCopy,
  ...props
}: ChatShareDialogProps) {
  const t = useTranslations("Components.Showcase.ChatShareDialog")
  const { copyToClipboard } = useCopyToClipboard({ timeout: 1000 })
  const [isSharePending, startShareTransition] = React.useTransition()

  const copyShareLink = React.useCallback(
    async (chat: Chat) => {
      if (!chat.sharePath) {
        toast({
          title: t("toast-error-title"),
          variant: "destructive",
        })
        return
      }

      const url = new URL(window.location.href)
      if (chat.sharePath) {
        url.pathname = chat.sharePath
      }
      copyToClipboard(url.toString())
      onCopy()
      toast({
        title: t("toast-success-title"),
      })
    },
    [copyToClipboard, onCopy]
  )

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("share-title")}</DialogTitle>
          <DialogDescription>{t("share-description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1 rounded-md border p-4 text-sm">
          <div className="font-medium">{chat.title}</div>
          <div className="text-muted-foreground">
            {chat.messages.length} messages
          </div>
        </div>
        <DialogFooter className="items-center">
          <Button
            disabled={isSharePending}
            onClick={() => {
              startShareTransition(async () => {
                const result = await shareChat(chat.id)

                if (result && "error" in result) {
                  toast({
                    title: t("toast-error-title"),
                    variant: "destructive",
                  })
                  return
                }

                copyShareLink(result)
              })
            }}
          >
            {isSharePending ? (
              <>
                <IconSpinner className="mr-2 animate-spin" />
                {t("sharing")}...
              </>
            ) : (
              <>{t("copy")}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
