import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/prisma"
import { verifyCurrentStudent } from "@/lib/session"

const routeContextSchema = z.object({
  params: z.object({
    classCode: z.string(),
  }),
})
export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { classCode },
  } = routeContextSchema.parse(context)
  const { userId } = await req.json()

  if (!(await verifyCurrentStudent(userId))) {
    return NextResponse.json(
      { message: "You are not authorized leave a classroom" },
      { status: 403 }
    )
  }

  const student = await db.student.findUnique({
    where: {
      userId,
    },
  })

  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 })
  }

  const classroom = await db.classroom.findFirst({
    where: {
      classCode,
    },
  })

  if (!classroom) {
    return NextResponse.json(
      { message: "Classroom not found" },
      { status: 404 }
    )
  }

  try {
    await db.classroom.update({
      where: {
        id: classroom.id,
        classCode,
      },
      data: {
        students: {
          disconnect: {
            id: student.id,
          },
        },
      },
    })

    return NextResponse.json({ message: "Leave classroom" }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Error Joining classroom" },
      { status: 500 }
    )
  }
}
