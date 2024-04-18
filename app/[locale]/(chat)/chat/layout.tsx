import { Student, User } from "@prisma/client";
import { getTranslations } from "next-intl/server";

import { redirect } from "@lib/navigation";
import { NextAuthUser } from "@/types/auth";
import { SidebarProvider } from "@hook/use-sidebar";
import {
  getCurrentUser,
  userAuthentificateVerification,
  getCurrentStudent,
} from "@lib/session";

import { Header } from "@component/navigation/ChatHeader";

import { SidebarDesktop } from "@component/navigation/SidebarDesktop";

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Chat");
  return { title: `${t("title")}` };
}

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  const user = await getCurrentUser();

  const toRedirect = await userAuthentificateVerification(
    user as NextAuthUser,
    "STUDENT"
  );

  if (toRedirect) {
    redirect(toRedirect);
  }

  if (!user) {
    return null;
  }

  const student = (await getCurrentStudent(user.id)) as Student & {
    user: User;
  };

  return (
    <SidebarProvider>
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
        <Header />
        <SidebarDesktop student={student} />
        <div className="group w-full overflow-auto pl-0 duration-300 ease-in-out animate-in peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
