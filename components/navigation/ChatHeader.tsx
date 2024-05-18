import { Student, User } from "@prisma/client"

import { ChatHistory } from "@/components/display/ChatHistory"
import { UserMenuIconDropdown } from "@/components/display/UserMenu"
import { SidebarToggle } from "@/components/layout/sidebar-toggle"
import { SidebarMobile } from "@/components/navigation/SidebarMobile"
import { Icons } from "@/components/shared/icons"

//TODO: Change this header
export function Header({ student }: { student: Student & { user: User } }) {
  return (
    <header className="absolute top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <nav className="flex items-center">
          <SidebarMobile>
            <ChatHistory student={student} />
          </SidebarMobile>
          <SidebarToggle />
          <div className="flex items-center">
            <Icons.slash className="size-6 text-muted-foreground/50" />
            <UserMenuIconDropdown user={student.user} />
          </div>
        </nav>
      </div>
    </header>
  )
}
