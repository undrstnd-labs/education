import { Student, User } from "@prisma/client"

import { getCurrentStudent, getCurrentUser } from "@/lib/session"
import { generateUuid } from "@/lib/utils"

import { Chat } from "@/components/display/Chat"

export default async function IndexPage() {
  const id = generateUuid()
  const user = await getCurrentUser()

  const student = (await getCurrentStudent(user!.id)) as Student & {
    user: User
  }

  return <Chat id={id} student={student} />
}
