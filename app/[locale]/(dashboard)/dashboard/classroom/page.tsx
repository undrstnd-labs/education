import { redirect } from "@/lib/navigation";
import { getCurrentUser, getCurrentEntity } from "@/lib/session";
import { User, Student, Teacher } from "@prisma/client";

import { AddClassroom } from "@/components/form/AddClassroom";
import JoinClassroom from "@/components/form/JoinClassroom";
import { ClassroomCard } from "@/components/display/ClassroomCard";
import { classroom } from "@/types/classroom";

async function getClassrooms(user: User) {
  const entity = (await getCurrentEntity(user)) as Student | Teacher;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/classrooms/${user.role.toLowerCase()}/${entity.id}`,
      {
        method: "GET",
        next: {
          revalidate: 0,
        },
      }
    );

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

  const classrooms = await getClassrooms(user!);

  return (
    <div className="w-full p-4 ">
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
