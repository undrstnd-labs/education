"use server"

import { Classroom, Student, Teacher } from "@prisma/client"

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

export async function handleArchiveClassroom(
  isArchive: boolean,
  classroom: Classroom
) {
  const classroomArchived = await db.classroom.update({
    where: {
      id: classroom.id,
    },
    data: {
      isArchived: isArchive,
    },
  })

  if (isArchive) {
    const students = await db.student.findMany({
      where: {
        classrooms: {
          some: {
            id: classroomArchived.id,
          },
        },
      },
    })

    for (const student of students) {
      await db.student.update({
        where: {
          id: student.id,
        },
        data: {
          classrooms: {
            disconnect: {
              id: classroomArchived.id,
            },
          },
        },
      })
    }
  }

  return classroomArchived
}

export async function deleteClassroom(teacher: Teacher, classroom: Classroom) {
  const students = await db.student.findMany({
    where: {
      classrooms: {
        some: {
          id: classroom.id,
        },
      },
    },
  })

  for (const student of students) {
    await db.student.update({
      where: {
        id: student.id,
      },
      data: {
        classrooms: {
          disconnect: {
            id: classroom.id,
          },
        },
      },
    })
  }

  return await db.classroom.delete({
    where: {
      id: classroom.id,
      teacherId: teacher.id,
    },
  })
}

export async function editClasroom(
  teacher: Teacher,
  classroom: Classroom,
  data: any
) {
  return await db.classroom.update({
    where: {
      id: classroom.id,
      teacherId: teacher.id,
    },
    data,
  })
}

export async function leaveClassroom(student: Student, classroom: Classroom) {
  return await db.classroom.update({
    where: {
      id: classroom.id,
    },
    data: {
      students: {
        disconnect: {
          id: student.id,
        },
      },
    },
  })
}

export async function getStudents(classroom: Classroom) {
  return await db.student.findMany({
    where: {
      classrooms: {
        some: {
          id: classroom.id,
        },
      },
    },
    include: {
      user: true,
    },
  })
}

export async function getStudentsUniversity(
  classroom: Classroom,
  universitySlug: string
) {
  return await db.student.findMany({
    where: {
      user: {
        universitySlug,
      },
      classrooms: {
        none: {
          id: classroom.id,
        },
      },
    },
    include: {
      user: true,
    },
  })
}
