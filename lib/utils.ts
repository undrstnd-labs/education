import { v4 as uuidv4 } from "uuid";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

import { getChat } from "@lib/actions";
import { emailSchema } from "@config/schema";
import { type Message } from "ai/react";

/**
 * Combines class names into a single string with deduplicated classes.
 * Uses `clsx` for generating a combined class string and `twMerge` to merge Tailwind CSS classes.
 * @param {...ClassValue[]} inputs - Class names to combine.
 * @return {string} The combined class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function verifyEmail(email: string): boolean {
  return emailSchema.safeParse({ email }).success;
}

export function generateUuid() {
  return uuidv4();
}

export async function getFormattedChat(chatId: string, studentId: string) {
  const chat = await getChat(chatId, studentId);

  const newChat = {
    ...chat,
    messages: chat!.messages.map((message) => {
      if (message.role === "USER") {
        return { ...message, role: "user" as Message["role"] };
      } else if (message.role === "AI") {
        return { ...message, role: "assistant" as Message["role"] };
      } else {
        return { ...message, role: "assistant" as Message["role"] };
      }
    }),
  };

  return newChat;
}
