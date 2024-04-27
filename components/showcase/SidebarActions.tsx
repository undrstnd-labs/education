"use client"

import * as React from "react"
import { ServerActionResult } from "@/types"
import { useRouter } from "@navigation"
import { useTranslations } from "next-intl"

import { type Chat } from "@/types/chat"

import { toast } from "@/hooks/use-toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog"
import { Button } from "@/components/ui/Button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { IconShare, IconSpinner, IconTrash } from "@/components/icons/Overall"
import { ChatShareDialog } from "@/components/showcase/ChatShareDialog"

interface SidebarActionsProps {
  chat: Chat
  removeChat: (args: {
    id: string
    path: string
  }) => Promise<ServerActionResult<void>>
  //shareChat: (id: string) => ServerActionResult<Chat>;
}

export function SidebarActions({
  chat,
  removeChat,
  // shareChat,
}: SidebarActionsProps) {
  const router = useRouter()
  const t = useTranslations("Components.Showcase.SidebarActions")
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()

  return (
    <div>
      <div className="flex items-center space-x-2 py-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled
                variant="ghost"
                size={"small-icon"}
                className="size-8 p-0 hover:bg-background"
                onClick={() => setShareDialogOpen(true)}
              >
                <IconShare />
                <span className="sr-only">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("share-chat")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={"small-icon"}
                className="size-8 p-0 hover:bg-background"
                disabled={isRemovePending}
                onClick={() => setDeleteDialogOpen(true)}
              >
                {isRemovePending ? (
                  <IconSpinner className="animate-spin" />
                ) : (
                  <IconTrash />
                )}
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("delete-chat")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/*       <ChatShareDialog
        chat={chat}
        shareChat={shareChat}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onCopy={() => setShareDialogOpen(false)}
      /> */}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete-chat-title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete-chat-description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending}
              onClick={(event) => {
                event.preventDefault()
                // @ts-ignore
                startRemoveTransition(async () => {
                  const result = await removeChat({
                    id: chat.id,
                    path: chat.path,
                  })

                  if (result && "error" in result) {
                    toast({
                      title: t("delete-chat-error"),
                      description: result.error,
                    })
                    return
                  }

                  setDeleteDialogOpen(false)
                  router.refresh()
                  router.push("/chat")
                  toast({
                    title: t("delete-chat-success"),
                  })
                })
              }}
            >
              {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
              {t("delete-chat-confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
