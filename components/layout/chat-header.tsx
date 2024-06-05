import { Link } from "@navigation"
import { Student, User } from "@prisma/client"

import { ChatHistory } from "@/components/app/chat-history"
import { ChatSidebarMobile } from "@/components/layout/chat-sidebar-mobile"
import { ChatSidebarToggle } from "@/components/layout/chat-sidebar-toggle"
import { Icons, LogoPNG } from "@/components/shared/icons"
import { UserMenuIconDropdown } from "@/components/shared/user-menu"
import { Button } from "@/components/ui/button"

export function ChatHeader({ student }: { student: Student & { user: User } }) {
  return (
    <header className="absolute top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <nav className="flex items-center space-x-2">
          <ChatSidebarMobile>
            <ChatHistory student={student} />
          </ChatSidebarMobile>
          <Link href="/feed" aria-label="Home">
            <Button className="flex items-center gap-2" variant={"ghost"}>
              <LogoPNG className="-mt-1 h-7 w-auto" />
              <p className="text-base font-bold text-zinc-700 dark:text-zinc-300 ">
                Undrstnd
              </p>
            </Button>
          </Link>
          <Icons.slash className="size-4 text-muted-foreground/50" />
          <ChatSidebarToggle />
        </nav>
      </div>
      <UserMenuIconDropdown user={student.user} />
    </header>
  )
}
