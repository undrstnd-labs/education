"use client";

import * as React from "react";
import { toast } from "@hook/use-toast";
import { useRouter } from "@lib/navigation";
import { useTranslations } from "next-intl";

import { type Chat } from "@/types/chat";
import { ServerActionResult } from "@/types";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@component/ui/AlertDialog";
import { Button } from "@/components/ui/Button";
import { ChatShareDialog } from "@component/showcase/ChatShareDialog";
import { IconShare, IconSpinner, IconTrash } from "@component/icons/Overall";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@component/ui/Tooltip";

interface SidebarActionsProps {
  chat: Chat;
  removeChat: (args: {
    id: string;
    path: string;
  }) => Promise<ServerActionResult<void>>;
  shareChat: (id: string) => ServerActionResult<Chat>;
}

export function SidebarActions({
  chat,
  removeChat,
  shareChat,
}: SidebarActionsProps) {
  const router = useRouter();
  const t = useTranslations("Components.Showcase.SidebarActions");
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isRemovePending, startRemoveTransition] = React.useTransition();

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="size-7 p-0 hover:bg-background"
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
              className="size-7 p-0 hover:bg-background"
              disabled={isRemovePending}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <IconTrash />
              <span className="sr-only">Delete</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("delete-chat")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ChatShareDialog
        chat={chat}
        shareChat={shareChat}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onCopy={() => setShareDialogOpen(false)}
      />
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
                event.preventDefault();
                // @ts-ignore
                startRemoveTransition(async () => {
                  const result = await removeChat({
                    id: chat.id,
                    path: chat.path,
                  });

                  if (result && "error" in result) {
                    toast({
                      title: t("delete-chat-error"),
                      description: result.error,
                    });
                    return;
                  }

                  setDeleteDialogOpen(false);
                  router.refresh();
                  router.push("/");
                  toast({
                    title: t("delete-chat-success"),
                  });
                });
              }}
            >
              {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
              {t("delete-chat-confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
