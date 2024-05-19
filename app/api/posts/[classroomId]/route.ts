import { NextResponse } from "next/server"
import * as z from "zod"

import { db } from "@/lib/prisma"
import { getCurrentUser, verifyCurrentTeacher } from "@/lib/session"

const routeContextSchema = z.object({
  params: z.object({
    classroomId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const {
      params: { classroomId },
    } = routeContextSchema.parse(context)

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const classroom = await db.classroom.findUnique({
      where: {
        id: classroomId,
      },
    })

    if (!classroom) {
      return NextResponse.json(
        { message: "Classroom not found" },
        { status: 404 }
      )
    }

    if (user.role === "TEACHER") {
      const teacher = await db.teacher.findUnique({
        where: {
          userId: user.id,
        },
      })

      if (!teacher) {
        return NextResponse.json(
          { message: "Teacher not found" },
          { status: 404 }
        )
      }

      if (teacher.id !== classroom.teacherId) {
        return NextResponse.json(
          { message: "Teacher is not in the classroom" },
          { status: 403 }
        )
      }
    }

    if (user.role === "STUDENT") {
      const student = await db.student.findUnique({
        where: {
          userId: user.id,
        },
      })

      if (!student) {
        return NextResponse.json(
          { message: "Student not found" },
          { status: 404 }
        )
      }

      const classroomStudent = await db.classroom.findFirst({
        where: {
          id: classroomId,
          students: {
            some: {
              id: student.id,
            },
          },
        },
      })

      if (!classroomStudent) {
        return NextResponse.json(
          { message: "Student is not in the classroom" },
          { status: 403 }
        )
      }
    }

    const posts = await db.post.findMany({
      where: {
        classroomId,
      },
      include: {
        files: true,
        comments: true,
        reactions: true,
      },
    })
    return NextResponse.json(posts, { status: 200 })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
