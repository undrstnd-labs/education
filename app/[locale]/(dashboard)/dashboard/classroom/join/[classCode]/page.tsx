import { JoinClassroom } from "@/components/showcase/JoinClassroom";
import { redirect } from "@/lib/navigation";
import { getCurrentUser } from "@/lib/session";

const JoinClassroomPage = async ({
  params: { classCode },
}: {
  params: { classCode: string };
}) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user?.role !== "STUDENT" || classCode.length !== 8) {
    redirect("/dashboard/classroom");
  }
  return <JoinClassroom userId={user?.id!} classCode={classCode} />;
};

export default JoinClassroomPage;