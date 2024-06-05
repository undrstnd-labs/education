import { Student, User } from "@prisma/client"

import { ChatHistory } from "@/components/display/ChatHistory"
import { Sidebar } from "@/components/layout/sidebar"

export function SidebarDesktop({
  student,
}: {
  student: Student & { user: User }
}) {
  return (
    <Sidebar className="peer fixed left-0 top-1/2 z-30 hidden -translate-x-full -translate-y-1/2 rounded-r-lg border bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      <ChatHistory student={student} />
    </Sidebar>
  )
}
