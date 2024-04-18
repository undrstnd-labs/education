import { type Metadata } from "next";
import { Student, User } from "@prisma/client";

import { getChat } from "@lib/actions";
import { redirect } from "@lib/navigation";
import { getFormattedChat } from "@lib/utils";
import { getCurrentUser, getCurrentStudent } from "@lib/session";

import { Chat } from "@component/display/Chat";

export interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const user = await getCurrentUser();

  const student = (await getCurrentStudent(user!.id)) as Student & {
    user: User;
  };

  const chat = await getChat(params.chatId, student.id);
  return {
    title: `${chat?.title.toString().slice(0, 50)} | Undrstnd` ?? "Chat",
  };
}

export default async function ChatPage({
  params,
}: {
  params: { chatId: string };
}) {
  const user = await getCurrentUser();

  const student = (await getCurrentStudent(user!.id)) as Student & {
    user: User;
  };

  const chat = await getFormattedChat(params.chatId, student.id);

  if (!chat) {
    redirect("/chat");
  }

  if (chat?.studentId && chat.studentId !== student.id) {
    redirect("/chat");
  }

  return (
    <Chat id={chat!.id} student={student} initialMessages={chat!.messages} />
  );
}
