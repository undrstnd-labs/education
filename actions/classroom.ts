"use server"

import { Student, Teacher } from "@prisma/client"

import { db } from "@/lib/prisma"

export async function joinClassroom(user: Student, classCode: string) {
  const classroom = await db.classroom.findFirst({
    where: {
      classCode,
    },
    include: {
      students: true,
    },
  })

  if (!classroom) {
    return {
      status: 404,
      message: "Classroom not found",
    }
  }

  if (classroom.isArchived) {
    return {
      status: 301,
      message: "Classroom is archived",
    }
  }

  if (classroom.students.some((std) => std.id === user.id)) {
    return {
      status: 400,
      message: "You are already a student of this classroom",
    }
  }

  const classroomJoined = await db.classroom.update({
    where: {
      id: classroom.id,
    },
    data: {
      students: {
        connect: {
          id: user.id,
        },
      },
    },
  })

  return {
    status: 200,
    message: classroomJoined,
  }
}

export async function createClassroom(
  classCode: string,
  teacher: Teacher,
  name: string,
  description?: string
) {
  return await db.classroom.create({
    data: {
      name,
      description,
      teacherId: teacher.id,
      classCode,
    },
  })
}
