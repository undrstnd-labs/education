import { type Metadata } from "next"
import { redirect } from "@navigation"
import { Student, Teacher, User } from "@prisma/client"
import { unstable_setRequestLocale } from "next-intl/server"

import { NextAuthUser } from "@/types/auth"

import {
  getCurrentEntity,
  getCurrentUser,
  userAuthentificateVerification,
} from "@/lib/session"

import { FeedClassroomAddPost } from "@/components/app/feed-classroom-add-post"
import { FeedClassroomCard } from "@/components/app/feed-classroom-card"
import { FeedClassroomPosts } from "@/components/app/feed-classroom-posts"

export interface ClassroomProps {
  params: {
    classroomId: string
  }
}

export async function generateMetadata({
  params,
}: ClassroomProps): Promise<Metadata> {
  const user = await getCurrentUser()

  if (!user) {
    return {}
  }
  const { classroom } = await getClassroom(user, params.classroomId)

  return {
    title:
      `${classroom?.name.toString().slice(0, 50)} | Undrstnd` ?? "Classroom",
  }
}

async function getClassroom(user: User, classroomId: string) {
  const entity = (await getCurrentEntity(user)) as
    | (Student & { user: User })
    | (Teacher & { user: User })

  try {
    const classroom = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/classrooms/${classroomId}/${user.role.toLowerCase()}/${entity.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          revalidate: 0,
        },
      }
    ).then((res) => res.json())

    return {
      entity,
      classroom,
    }
  } catch (error) {
    console.log(error)
    return {
      entity,
      classroom: {},
    }
  }
}

export default async function ClassroomPage({
  params: { locale, classroomId },
}: {
  params: { classroomId: string; locale: string }
}) {
  unstable_setRequestLocale(locale)

  const user = await getCurrentUser()
  const toRedirect = await userAuthentificateVerification(user as NextAuthUser)

  if (toRedirect) {
    redirect(toRedirect)
  }

  if (!user) {
    return null
  }

  const { entity, classroom } = await getClassroom(user, classroomId)

  if (!classroom) {
    return redirect("/classroom")
  }

  return (
    <div className="flex flex-col gap-4">
      <FeedClassroomCard entity={entity} classroom={classroom} />
      {user.role === "TEACHER" && classroom.posts.length > 0 && (
        <FeedClassroomAddPost teacher={entity} classroom={classroom} />
      )}

      <FeedClassroomPosts
        classroom={classroom}
        role={user.role}
        entity={entity}
      />
    </div>
  )
}
