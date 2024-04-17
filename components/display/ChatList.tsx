import { type Message } from "ai";
import { Student, User } from "@prisma/client";

import { Separator } from "@component/ui/Separator";
import { ChatMessage } from "@component/showcase/ChatMessage";

export interface ChatList {
  messages: Message[];
  student: Student & { user: User };
}

export function ChatList({ messages, student }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage message={message} student={student} />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  );
}
