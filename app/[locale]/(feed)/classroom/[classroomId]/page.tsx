import { type Metadata } from "next"
import { redirect } from "@navigation"
import { Student, Teacher, User } from "@prisma/client"
import { unstable_setRequestLocale } from "next-intl/server"

import { NextAuthUser } from "@/types/auth"
import { Classroom } from "@/types/classroom"

import {
  getCurrentEntity,
  getCurrentUser,
  userAuthentificateVerification,
} from "@/lib/session"

import { FeedClassroomCard } from "@/components/app/feed-classroom-card"
import PostCard from "@/components/display/PostCard"
import { PostAddCard } from "@/components/form/PostAddCard"

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
  const entity = (await getCurrentEntity(user)) as Student | Teacher

  try {
    const classroom = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/classrooms/${classroomId}/${user.role.toLowerCase()}/${entity.id}`,
      {
        method: "GET",
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
      {user.role === "TEACHER" && (
        <PostAddCard userId={user.id} classroom={classroom} />
      )}
      <div className="flex flex-col gap-6">
        {classroom.posts && classroom.posts.length > 0 ? (
          classroom.posts
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((post: any) => (
              <PostCard
                key={post.id}
                post={post}
                userId={user.id}
                classroom={classroom}
                role={user.role}
              />
            ))
        ) : (
          // TODO: Adda a dotted line to the center of the page with a message
          <h1 className="font-bold md:text-xl">
            {user?.role === "TEACHER"
              ? "No posts. Create one now"
              : "No posts to show. Wait for the teacher to post something."}
          </h1>
        )}
      </div>
    </div>
  )
}
