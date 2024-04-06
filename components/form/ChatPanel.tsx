import * as React from "react";
import { useTranslations } from "next-intl";
import { type UseChatHelpers } from "ai/react";

import { shareChat } from "@lib/actions";

import { Prompt } from "@component/form/Prompt";
import { Icons } from "@component/icons/Lucide";
import { FooterText } from "@component/showcase/ChatFooter";
import { Button, ButtonScrollToBottom } from "@component/ui/Button";
import { ChatShareDialog } from "@component/showcase/ChatShareDialog";

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
  id?: string;
  title?: string;
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export function ChatPanel({
  id,
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
  const t = useTranslations("Components.Form.ChatPanel");
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 w-full animate-in duration-300 ease-in-out  peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex items-center justify-center h-12">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <Icons.stop className="mr-2 stroke-[1.25] size-5" />
              {t("stop-generating")}
            </Button>
          ) : (
            messages?.length >= 2 && (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => reload()}>
                  <Icons.refresh className="mr-2 stroke-[1.25] size-5" />
                  {t("regenerate")}
                </Button>
                {id && title ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShareDialogOpen(true)}
                    >
                      <Icons.share className="mr-2 stroke-[1.25] size-5" />
                      {t("share")}
                    </Button>
                    <ChatShareDialog
                      open={shareDialogOpen}
                      onOpenChange={setShareDialogOpen}
                      onCopy={() => setShareDialogOpen(false)}
                      shareChat={shareChat as any}
                      chat={{
                        id,
                        title,
                        messages,
                      }}
                    />
                  </>
                ) : null}
              </div>
            )
          )}
        </div>
        <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
          <Prompt
            onSubmit={async (value: string) => {
              await append({
                id,
                content: value,
                role: "user",
              });
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
