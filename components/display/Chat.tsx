"use client";

import { User } from "next-auth";
import { usePathname } from "@lib/navigation";
import { useChat, type Message } from "ai/react";

import { cn } from "@lib/utils";
import { toast } from "@hook/use-toast";
import { useScrollAnchor } from "@hook/use-scroll-anchor";

import { ChatPanel } from "@component/form/ChatPanel";
import { ChatList } from "@component/display/ChatList";
import { EmptyScreen } from "@component/showcase/ChatEmptyScreen";

export interface ChatProps extends React.ComponentProps<"div"> {
  id?: string;
  user: User;
  initialMessages?: Message[];
}

export function Chat({ id, initialMessages, className, user }: ChatProps) {
  const path = usePathname();
  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast({
            title: "Invalid OpenAI API key",
            description: "Please enter",
            variant: "destructive",
          });
        }
      },
      onFinish() {
        if (!path.includes("chat")) {
          window.history.pushState({}, "", `/chat/${id}`);
        }
      },
    });

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div className={cn("pb-[200px] pt-20", className)} ref={messagesRef}>
        {messages.length ? (
          <ChatList messages={messages} user={user} />
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
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
  );
}
