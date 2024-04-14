import { redirect } from "@/lib/navigation";
import { getCurrentUser } from "@/lib/session";

import { cookies } from "next/headers";
import { AddClassroom } from "@/components/form/AddClassroom";
import JoinClassroom from "@/components/form/JoinClassroom";
import { ClassroomCard } from "@/components/display/ClassroomCard";
import { classroom } from "@/types/classroom";

async function getCookie(name: string) {
  return cookies().get(name)?.value ?? "";
}

async function getClassroom() {
  const session = await getCookie("next-auth.session-token");

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/classrooms`, {
      method: "GET",
      headers: {
        Cookie: `next-auth.session-tokend=${session}`,
      },
    });

    if (res.ok) {
      const data: classroom[] = await res.json();
      return data;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
}

export default async function ClassroomsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const classrooms = await getClassroom();

  return (
    <div className="p-4 w-full ">
      {user?.role === "TEACHER" && <AddClassroom userId={user.id} />}
      {user?.role === "STUDENT" && <JoinClassroom userId={user.id} />}
      <div className="flex flex-col gap-6">
        {classrooms && classrooms.length > 0 ? (
          classrooms.map((classroom) => {
            return (
              <ClassroomCard
                classroom={classroom}
                key={classroom.id}
                authorId={user?.id!}
              />
            );
          })
        ) : (
          <h1 className="font-bold md:text-xl">
            {user?.role === "TEACHER"
              ? "No classrooms. Create one now"
              : "No classrooms to show. Join one now"}
          </h1>
        )}
      </div>
    </div>
  );
}
