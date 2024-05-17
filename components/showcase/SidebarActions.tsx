"use client"

import * as React from "react"
import { ServerActionResult } from "@/types"
import { useRouter } from "@navigation"
import { useTranslations } from "next-intl"

import { type Chat } from "@/types/chat"

import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarActionsProps {
  chat: Chat
  removeChat: (args: {
    id: string
    path: string
  }) => Promise<ServerActionResult<void>>
}

export function SidebarActions({ chat, removeChat }: SidebarActionsProps) {
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
                variant="ghost"
                size={"small-icon"}
                className="size-8 p-0 hover:bg-background"
                disabled={isRemovePending}
                onClick={() => setDeleteDialogOpen(true)}
              >
                {isRemovePending ? (
                  <Icons.spinner className="animate-spin" />
                ) : (
                  <Icons.trash />
                )}
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("delete-chat")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

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
                  router.push("/chat")

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
                  toast({
                    title: t("delete-chat-success"),
                  })
                })
              }}
            >
              {isRemovePending && (
                <Icons.spinner className="mr-2 animate-spin" />
              )}
              {t("delete-chat-confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
