import { redirect } from "@/lib/navigation"
import { getCurrentUser } from "@/lib/session"

import { JoinClassroom } from "@/components/showcase/JoinClassroom"

const JoinClassroomPage = async ({
  params: { classCode },
}: {
  params: { classCode: string }
}) => {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/login")
  }

  if (user.role !== "STUDENT" || classCode.length !== 8) {
    redirect("/classroom")
  }

  return <JoinClassroom userId={user?.id!} classCode={classCode} />
}

export default JoinClassroomPage
