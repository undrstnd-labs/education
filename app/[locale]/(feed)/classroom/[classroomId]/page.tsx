import { type Metadata } from "next"
import { redirect } from "@navigation"
import { Student, Teacher, User } from "@prisma/client"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { NextAuthUser } from "@/types/auth"

import {
  getCurrentEntity,
  getCurrentUser,
  userAuthentificateVerification,
} from "@/lib/session"

import {
  FeedClassroomAddPost,
  FeedClassroomAddPostTrigger,
} from "@/components/app/feed-classroom-add-post"
import { FeedClassroomCard } from "@/components/app/feed-classroom-card"
import { FeedClassroomPostCard } from "@/components/app/feed-classroom-post-card"
import { Icons } from "@/components/shared/icons"

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
  const t = await getTranslations("app.pages.classroom")

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

      <div className="flex flex-col gap-6">
        {classroom.posts && classroom.posts.length > 0 ? (
          classroom.posts
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((post: any) => (
              <FeedClassroomPostCard
                key={post.id}
                post={post}
                userId={user.id}
                classroom={classroom}
                role={user.role}
              />
            ))
        ) : (
          <>
            {user.role === "TEACHER" && (
              <div className="flex flex-col">
                <div className="block w-full flex-grow rounded-lg border-2 border-dashed border-secondary-foreground/20 p-12 text-center transition-all duration-300 hover:border-secondary-foreground/50">
                  <Icons.add className="mx-auto size-24 text-secondary-foreground/60" />
                  <span className="text-md mt-2 block font-semibold text-secondary-foreground">
                    {t("add-post")}
                  </span>
                  <p className="mt-2 block text-sm font-normal text-secondary-foreground/60">
                    {t("add-post-description")}
                  </p>
                  <div className="py-6">
                    <FeedClassroomAddPostTrigger
                      teacher={entity}
                      classroom={classroom}
                    />
                  </div>
                </div>
              </div>
            )}
            {user.role === "STUDENT" && (
              <div className="flex flex-col">
                <div className="block w-full flex-grow rounded-lg border-2 border-dashed border-secondary-foreground/20 p-12 text-center transition-all duration-300 hover:border-secondary-foreground/50">
                  <Icons.sleep className="mx-auto size-24 text-secondary-foreground/60" />
                  <span className="text-md mt-2 block font-semibold text-secondary-foreground">
                    {t("nothing-title")}
                  </span>
                  <p className="mt-2 block text-sm font-normal text-secondary-foreground/60">
                    {t("nothing-paragraph")}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
