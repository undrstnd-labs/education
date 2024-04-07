import * as React from "react";
import { User } from "next-auth";
import { useTranslations } from "next-intl";

import { cn } from "@lib/utils";
import { Link } from "@lib/navigation";

import { Icons } from "@component/icons/Lucide";
import { buttonVariants } from "@/components/ui/Button";
import { SidebarList } from "@component/display/SidebarList";

export async function ChatHistory({ user }: { user: User }) {
  const t = useTranslations("Components.Display.ChatHistory");

  return (
    <div className="flex flex-col max-h-[750px]">
      <div className="px-2 my-4">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10"
          )}
        >
          <Icons.add className="-translate-x-2 stroke-2" />
          {t("newChat")}
        </Link>
      </div>
      <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      >
        <SidebarList user={user} />
      </React.Suspense>
    </div>
  );
}
