import { cache } from "react";
import { useTranslations } from "next-intl";
import { Student, User } from "@prisma/client";

import { SidebarItems } from "@component/display/SidebarItems";

import { getChats } from "@lib/actions";

const loadChats = cache(async (studentId?: string) => {
  return await getChats(studentId);
});

export async function SidebarList({
  student,
}: {
  student: Student & { user: User };
}) {
  const t = useTranslations("Components.Display.SidebarList");
  const chats = await loadChats(student?.id);

  return (
    <div className="flex h-fit flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {chats?.length ? (
          <div className="space-y-2 px-2 py-4">
            <SidebarItems chats={chats as any} />
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
