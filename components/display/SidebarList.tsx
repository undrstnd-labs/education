import { cache } from "react";
import { User } from "next-auth";
import { useTranslations } from "next-intl";

import { SidebarItems } from "@component/display/SidebarItems";

import { getChats } from "@lib/actions";

const loadChats = cache(async (userId?: string) => {
  return await getChats(userId);
});

export async function SidebarList({ user }: { user: User }) {
  const t = useTranslations("Components.Display.SidebarList");
  const chats = await loadChats(user.id);

  return (
    <div className="flex flex-1 flex-col overflow-hidden h-fit">
      <div className="flex-1 overflow-auto">
        {chats?.length ? (
          <div className="space-y-2 px-2 py-2">
            <SidebarItems chats={chats} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">{t("no-chats")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
