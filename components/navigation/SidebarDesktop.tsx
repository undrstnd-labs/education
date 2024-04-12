import { User } from "next-auth";

import { Sidebar } from "@component/navigation/Sidebar";
import { ChatHistory } from "@component/display/ChatHistory";

export async function SidebarDesktop({ user }: { user: User }) {
  return (
    <Sidebar className="peer fixed top-1/2 left-0 z-30 hidden -translate-x-full -translate-y-1/2 rounded-r-lg border bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      <ChatHistory user={user} />
    </Sidebar>
  );
}
