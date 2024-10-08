import { User } from "@prisma/client"
import { getServerSession } from "next-auth/next"

import { NextAuthUser } from "@/types/auth"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function verifyCurrentUser(userId: string, notAssigned?: boolean) {
  const session = await getCurrentUser()

  if (!session) {
    return false
  }

  if (notAssigned && session.role === "NOT_ASSIGNED") {
    return true
  }

  const teacherCount = await db.teacher.count({
    where: {
      userId,
    },
  })

  const studentCount = await db.student.count({
    where: {
      userId,
    },
  })

  return teacherCount > 0 || studentCount > 0
}

export async function verifyCurrentTeacher(userId: string) {
  const session = await getCurrentUser()

  if (!session) {
    return false
  }

  const teacherCount = await db.teacher.count({
    where: {
      userId,
    },
  })

  return teacherCount > 0
}

export async function verifyCurrentStudent(userId: string) {
  const session = await getCurrentUser()

  if (!session) {
    return false
  }

  const studentCount = await db.student.count({
    where: {
      userId,
    },
  })

  return studentCount > 0
}

export async function userAuthentificateVerification(
  user: NextAuthUser,
  allowedRoles?: string
) {
  if (!user) {
    return "/login"
  }

  if (user.role === "NOT_ASSIGNED") {
    return "/onboarding"
  }

  if (allowedRoles && user.role !== allowedRoles) {
    return "/dashboard"
  }

  return null
}

export async function getCurrentStudent(userId?: string) {
  const session = await getCurrentUser()

  if (!session) {
    return false
  }

  return await db.student
    .findUnique({
      where: {
        userId: userId || session.id,
      },
      include: {
        user: true,
      },
    })
    .catch(() => null)
}

export async function getCurrentEntity(user: User) {
  if (user.role === "TEACHER") {
    return await db.teacher.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    })
  }

  return await db.student.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      user: true,
    },
  })
}
