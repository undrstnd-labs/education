import { NextResponse } from "next/server"
import * as z from "zod"

import { db } from "@/lib/prisma"
import { getCurrentUser, verifyCurrentTeacher } from "@/lib/session"

const routeContextSchema = z.object({
  params: z.object({
    teacherId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { teacherId },
  } = routeContextSchema.parse(context)

  const classrooms = await db.classroom.findMany({
    where: {
      teacherId,
    },
    include: {
      teacher: {
        include: {
          user: true,
        },
      },
    },
  })

  return NextResponse.json(classrooms, { status: 200 })
}

export async function POST(req: Request) {
  const { userId, name, description, classCode } = await req.json()

  if (!(await verifyCurrentTeacher(userId))) {
    return NextResponse.json(
      { message: "You are not authorized to create a classroom" },
      { status: 403 }
    )
  }

  const teacher = await db.teacher.findUnique({
    where: {
      userId,
    },
  })

  if (!teacher) {
    return NextResponse.json({ message: "Teacher not found" }, { status: 404 })
  }

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 })
  }
  if (!classCode) {
    return NextResponse.json(
      { message: "Class code is required" },
      { status: 400 }
    )
  }

  try {
    const classroom = await db.classroom.create({
      data: {
        name,
        description,
        teacherId: teacher.id,
        classCode,
      },
    })

    return NextResponse.json(classroom, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Error creating classroom" },
      { status: 500 }
    )
  }
}
