import { Student, User } from "@prisma/client"
import { unstable_setRequestLocale } from "next-intl/server"

import { getCurrentStudent, getCurrentUser } from "@/lib/session"
import { generateUuid } from "@/lib/utils"

import { ChatContext } from "@/components/app/chat-context"

export default async function IndexPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)

  const id = generateUuid()
  const user = await getCurrentUser()

  const student = (await getCurrentStudent(user!.id)) as Student & {
    user: User
  }

  return <ChatContext id={id} student={student} />
}
