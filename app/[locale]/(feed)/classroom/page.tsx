import { Student, Teacher, User } from "@prisma/client"

import { Classroom } from "@/types/classroom"

import { redirect } from "@/lib/navigation"
import { getCurrentEntity, getCurrentUser } from "@/lib/session"

import { ClassroomCard } from "@/components/display/ClassroomCard"

async function getClassrooms(user: User) {
  const entity = (await getCurrentEntity(user)) as Student | Teacher
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/classrooms/${user.role.toLowerCase()}/${entity.id}`,
      {
        method: "GET",
        next: {
          revalidate: 0,
        },
      }
    )

    if (res.ok) {
      const data: Classroom[] = await res.json()
      return data
    }
    return null
  } catch (error) {
    console.log(error)
  }
}

export default async function ClassroomsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return redirect("/login")
  }

  const classrooms = await getClassrooms(user)

  return (
    <>
      <div className="flex flex-col gap-6">
        {classrooms && classrooms.length > 0 ? (
          classrooms.map((classroom) => {
            return (
              <ClassroomCard
                classroom={classroom}
                key={classroom.id}
                authorId={user?.id!}
              />
            )
          })
        ) : (
          <h1 className="font-bold md:text-xl">
            {user?.role === "TEACHER"
              ? "No classrooms. Create one now"
              : "No classrooms to show. Join one now"}
          </h1>
        )}
      </div>
    </>
  )
}
