"use server";

import { z } from "zod";
import { redirect } from "@lib/navigation";
import { pinSchema } from "@config/schema";

import { TokenType } from "@/types/auth";
import { type Chat } from "@/types/chat";

export async function verifyPassCode(form: z.infer<typeof pinSchema>) {
  const data = pinSchema.parse({
    email: form.email,
    pin: form.pin,
  });

  const fetchToken = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/token/${data.email}`
  ).then((res) => res.json());

  return {
    success: true,
    verification_token: fetchToken as TokenType,
  };
}

export async function getChats(userId?: string | null) {
  // TODO: Get chats for a specific user
  return [];
}

export async function getChat(id: string, userId: string) {
  // TODO: Get a specific chat for a specific user
  return [];
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  // TODO: Remove a specific chat
  return "";
}

export async function clearChats() {
  // TODO: Clear all chats
}

export async function getSharedChat(id: string) {
  // TODO: Get a shared chat
}

export async function shareChat(id: string) {
  // TODO: Share a chat
}

export async function saveChat(chat: Chat) {
  // TODO: Save a chat
}

export async function refreshHistory(path: string) {
  redirect(path);
}

export async function getMissingKeys() {
  const keysRequired = ["GROQ_API_KEY"];
  return keysRequired
    .map((key) => (process.env[key] ? "" : key))
    .filter((key) => key !== "");
}
