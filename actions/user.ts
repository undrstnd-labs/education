"use server"

import { User } from "@prisma/client"

import { db } from "@/lib/prisma"

export async function updateProfileImage(imageUrl: string, user: User) {
  return db.user.update({
    where: {
      id: user.id,
    },
    data: {
      image: imageUrl,
    },
  })
}

export async function updateUser(
  user: User,
  values: { name: string; bio?: string }
) {
  return db.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: values.name,
      bio: values.bio,
    },
  })
}

export async function updateUserOnboarding(user: User, values: any) {
  const userUpdated = await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: values.name,
      bio: values.bio,
      image: values.image,
      universitySlug: values.universitySlug,
      role: values.role,
    },
  })

  if (userUpdated && values.role === "TEACHER") {
    return await db.teacher.create({
      data: {
        userId: user.id,
      },
    })
  }

  if (userUpdated && values.role === "STUDENT") {
    return await db.student.create({
      data: {
        userId: user.id,
      },
    })
  }
}

export async function deleteAccount(user: User) {
  if (user.role === "STUDENT") {
    const classrooms = await db.classroom.findMany({
      where: {
        students: {
          some: {
            id: user.id,
          },
        },
      },
    })

    for (const classroom of classrooms) {
      await db.classroom.update({
        where: {
          id: classroom.id,
        },
        data: {
          students: {
            disconnect: {
              id: user.id,
            },
          },
        },
      })
    }
  }

  return db.user.delete({
    where: {
      id: user.id,
    },
  })
}
