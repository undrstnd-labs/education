import { getServerSession } from "next-auth/next";

import { db } from "@lib/prisma";
import { authOptions } from "@lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return session?.user;
}

export async function verifyCurrentUser(userId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false;
  }

  const teacherCount = await db.teacher.count({
    where: {
      userId,
    },
  });

  const studentCount = await db.student.count({
    where: {
      userId,
    },
  });

  return teacherCount > 0 || studentCount > 0;
}

export async function verifyCurrentTeacher(userId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false;
  }

  const teacherCount = await db.teacher.count({
    where: {
      userId,
    },
  });

  return teacherCount > 0;
}

export async function verifyCurrentStudent(userId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false;
  }

  const studentCount = await db.student.count({
    where: {
      userId,
    },
  });

  return studentCount > 0;
}
