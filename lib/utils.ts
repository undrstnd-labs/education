import { type Message } from "ai/react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from "uuid"

import { emailSchema } from "@/config/schema"
import { getChat } from "@/lib/actions"

/**
 * Combines class names into a single string with deduplicated classes.
 * Uses `clsx` for generating a combined class string and `twMerge` to merge Tailwind CSS classes.
 * @param {...ClassValue[]} inputs - Class names to combine.
 * @return {string} The combined class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function verifyEmail(email: string): boolean {
  return emailSchema.safeParse({ email }).success
}

export function generateUuid() {
  return uuidv4()
}

export async function getFormattedChat(chatId: string, studentId: string) {
  const chat = await getChat(chatId, studentId)

  const newChat = {
    ...chat,
    messages: chat!.messages.map((message: { role: string }) => {
      if (message.role === "USER") {
        return { ...message, role: "user" as Message["role"] }
      } else if (message.role === "AI") {
        return { ...message, role: "assistant" as Message["role"] }
      } else {
        return { ...message, role: "assistant" as Message["role"] }
      }
    }),
  }

  return newChat
}

export function formatDate(date: Date): string {
  const currentDate = new Date()
  const diffInSeconds = Math.floor(
    (currentDate.getTime() - date.getTime()) / 1000
  )

  if (diffInSeconds < 60) {
    return "Just now"
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}
