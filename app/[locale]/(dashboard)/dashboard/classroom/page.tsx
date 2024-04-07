import { redirect } from "@/lib/navigation";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Classroom } from "@prisma/client";
import { cookies } from "next/headers";
import ClassroomCard from "@/components/display/ClassroomCard";
import { getTranslations } from "next-intl/server";
import { AddClassroom } from "@/components/form/AddClassroom";
async function getCookie(name: string) {
  return cookies().get(name)?.value ?? "";
}
async function getClassroom() {
  const session = await getCookie("next-auth.session-token");
  const getUser = async (teacherId: string) => {
    const res = await db.teacher.findUnique({
      where: {
        id: teacherId,
      },
      include: {
        user: true,
      },
    });
    return res;
  };
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/classrooms`, {
      method: "GET",
      headers: {
        Cookie: `next-auth.session-tokend=${session}`,
      },
    });

    if (res.ok) {
      const data: Classroom[] = await res.json();

      const teacherPromises = data.map((classroom) =>
        getUser(classroom.teacherId)
      );
      const teachers = await Promise.all(teacherPromises);

      const classroomsWithTeachers = data.map((classroom, index) => {
        return { ...classroom, teacher: teachers[index] };
      });

      return classroomsWithTeachers;
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
  const t = await getTranslations("Pages.Classroom");
  return (
    <div className="p-4 w-full ">
      {user?.role === "TEACHER" && <AddClassroom userId={user.id} />}
      <div className="flex flex-col gap-6">
        {classrooms && classrooms.length > 0 ? (
          classrooms.map((classroom) => {
            return (
              <ClassroomCard classroom={classroom as any} key={classroom.id} />
            );
          })
        ) : (
          <h1>no classromm for students or teachers</h1>
        )}
      </div>
    </div>
  );
}
