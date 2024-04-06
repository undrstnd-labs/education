import { getTranslations } from "next-intl/server";

import { nanoid } from "@lib/utils";
import { NextAuthUser } from "@/types/auth";
import { getCurrentUser, userAuthentificateVerification } from "@lib/session";

import { Chat } from "@component/display/Chat";

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Chat");
  return { title: `${t("title")}` };
}

export default async function IndexPage() {
  const id = nanoid();
  const user = await getCurrentUser();

  if (
    !user ||
    !userAuthentificateVerification(user as NextAuthUser, "TEACHER")
  ) {
    return null;
  }

  return <Chat id={id} user={user} />;
}
