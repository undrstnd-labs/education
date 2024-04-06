import { User } from "next-auth";
import { type Message } from "ai";

import { Separator } from "@component/ui/Separator";
import { ChatMessage } from "@component/showcase/ChatMessage";

export interface ChatList {
  messages: Message[];
  user: User;
}

export function ChatList({ messages, user }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} user={user} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  );
}
