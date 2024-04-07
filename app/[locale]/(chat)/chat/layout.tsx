import { NextAuthUser } from "@/types/auth";
import { SidebarProvider } from "@hook/use-sidebar";
import { getCurrentUser, userAuthentificateVerification } from "@lib/session";

import { Header } from "@component/navigation/ChatHeader";
import { SidebarDesktop } from "@component/navigation/SidebarDesktop";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  const user = await getCurrentUser();

  if (
    !user ||
    !userAuthentificateVerification(user as NextAuthUser, "TEACHER")
  ) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
        <Header />
        <SidebarDesktop user={user} />
        <div className="group w-full overflow-auto pl-0 animate-in duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
