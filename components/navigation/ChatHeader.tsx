import * as React from "react";
import { NextAuthUser } from "@/types/auth";

import { getCurrentUser } from "@lib/session";

import { Icons } from "@component/icons/Lucide";
import { UserMenu } from "@component/display/UserMenu";
import { ChatHistory } from "@component/display/ChatHistory";
import { SidebarToggle } from "@component/config/SidebarToggle";
import { SidebarMobile } from "@component/navigation/SidebarMobile";

//TODO: Change this header
export async function Header() {
  const user = (await getCurrentUser()) as NextAuthUser;

  return (
    <header className="absolute top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <nav className="flex items-center">
          <SidebarMobile>
            <ChatHistory user={user} />
          </SidebarMobile>
          <SidebarToggle />
          <div className="flex items-center">
            <Icons.slash className="size-6 text-muted-foreground/50" />
            <UserMenu user={user} />
          </div>
        </nav>
      </div>
    </header>
  );
}
