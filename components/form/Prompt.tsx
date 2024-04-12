import * as React from "react";
import { UseChatHelpers } from "ai/react";
import { useTranslations } from "next-intl";

import { cn } from "@lib/utils";
import { useRouter } from "@lib/navigation";
import { useEnterSubmit } from "@hook/use-enter-submit";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@component/ui/Tooltip";
import { Icons } from "@component/icons/Lucide";
import { Textarea } from "@component/ui/Textarea";
import { Button, buttonVariants } from "@/components/ui/Button";

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

export function Prompt({ onSubmit, input, setInput, isLoading }: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const t = useTranslations("Components.Form.Prompt");
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        setInput("");
        onSubmit(input);
      }}
      ref={formRef}
    >
      <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.refresh();
                  router.push("/chat");
                }}
                className={cn(
                  buttonVariants({ size: "icon", variant: "outline" }),
                  "absolute size-4 left-0 top-3 rounded-full bg-background p-0 sm:left-4"
                )}
              >
                <Icons.add className="size-4 rounded-full" />
                <span className="sr-only">New Chat</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>{t("new-chat")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("send-message") + "..."}
          spellCheck={false}
          className="min-h-[60px] w-full border-none resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
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
    </form>
  );
}
