import { Activity, Classroom } from "@/types"
import { Comment, Post, Student, Teacher, User } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { customAlphabet } from "nanoid"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from "uuid"

import { emailSchema } from "@/config/schema"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function verifyEmail(email: string): boolean {
  return emailSchema.safeParse({ email }).success
}

export function generateUuid() {
  return uuidv4()
}

export function generateHash() {
  const nanoid = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    8
  )
  return nanoid()
}

export function formatDate(date: Date, t: (arg: string) => string): string {
  const currentDate = new Date()
  const diffInSeconds = Math.floor(
    (currentDate.getTime() - date.getTime()) / 1000
  )

  if (diffInSeconds < 60) {
    return t("just-now")
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} ${t("minutes-ago")}`
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} ${t("hours-ago")}`
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)} ${t("days-ago")}`
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}

export function processActivities(
  data: Classroom[],
  t: (arg: string) => string
): Activity[][] {
  const groupedActivities: Activity[][] = []

  data.forEach((classroom: Classroom) => {
    const activities: Activity[] = []
    const posts = classroom.teacher.posts

    posts.forEach((post: Post) => {
      const postActivity: Activity = {
        id: post.id,
        type: "post",
        user: {
          name: `${classroom.teacher.user.name}`,
          image: classroom.teacher.user.image,
        },
        imageUrl: classroom.teacher.user.image,
        comment: post.content,
        date: formatDate(new Date(post.createdAt), t),
        classroom: { id: classroom.id, name: classroom.name },
      }

      activities.push(postActivity)

      // @ts-ignore: Object is possibly 'null'.
      post.comments.forEach(
        (
          comment: Comment & {
            user: User
          }
        ) => {
          const commentActivity: Activity = {
            id: comment.id,
            type: "comment",
            user: {
              name: `${comment.user.name}`,
              image: comment.user.image!,
            },
            imageUrl: comment.user.image!,
            date: formatDate(new Date(comment.createdAt), t),
            classroom: { id: classroom.id, name: classroom.name },
            post: { id: post.id, name: post.name },
          }

          activities.push(commentActivity)
        }
      )
    })

    groupedActivities.push(activities)
  })

  return groupedActivities
}
