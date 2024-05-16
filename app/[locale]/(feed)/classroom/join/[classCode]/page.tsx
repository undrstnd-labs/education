import { redirect } from "@navigation"
import { Student, Teacher, User } from "@prisma/client"

import { getCurrentEntity, getCurrentUser } from "@/lib/session"

import { joinClassroom } from "@/undrstnd/classroom"

export default async function JoinClassroomPage({
  params: { classCode },
}: {
  params: { classCode: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/login")
  }

  const entity = (await getCurrentEntity(user as User)) as Student | Teacher

  if (user.role != "STUDENT" || classCode.length !== 8) {
    redirect("/classroom")
  }

  const result = await joinClassroom(entity, classCode)

  if (result.status === 200) {
    if (typeof result.message === "object" && "id" in result.message) {
      redirect(`/classroom/${result.message.id}`)
    }
  }

  return redirect("/classroom")
}
