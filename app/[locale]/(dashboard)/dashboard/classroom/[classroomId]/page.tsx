// TODO: Generate metadata for this page

import { redirect } from "@navigation"
import { Student, Teacher, User } from "@prisma/client"

import { NextAuthUser } from "@/types/auth"
import { classroom } from "@/types/classroom"

import {
  getCurrentEntity,
  getCurrentUser,
  userAuthentificateVerification,
} from "@/lib/session"

import { ClassroomCard } from "@/components/display/ClassroomCard"
import PostCard from "@/components/display/PostCard"
import { PostAddCard } from "@/components/form/PostAddCard"

async function getClassroom(user: User, classroomId: string) {
  const entity = (await getCurrentEntity(user)) as Student | Teacher

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/classrooms/${classroomId}/${user.role.toLowerCase()}/${entity.id}`,
      {
        method: "GET",
        next: {
          revalidate: 0,
        },
      }
    ).then((res) => res.json())

    return res as classroom
  } catch (error) {
    console.log(error)
  }
}

export default async function ClassroomPage({
  params: { classroomId },
}: {
  params: { classroomId: string }
}) {
  const user = await getCurrentUser()
  const toRedirect = await userAuthentificateVerification(user as NextAuthUser)

  if (toRedirect) {
    redirect(toRedirect)
  }

  if (!user) {
    return null
  }

  const classroom = await getClassroom(user, classroomId)

  if (!classroom) {
    return redirect("/dashboard/classroom")
  }

  return (
    <div className="flex flex-col gap-4">
      <ClassroomCard authorId={user.id} classroom={classroom} />
      {user.role === "TEACHER" && (
        <PostAddCard userId={user.id} classroom={classroom} />
      )}
      <div className="flex flex-col gap-6">
        {classroom.posts && classroom.posts.length > 0 ? (
          classroom.posts
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((post) => (
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
