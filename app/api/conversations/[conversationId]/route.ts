import { NextResponse } from "next/server"
import * as z from "zod"

import { db } from "@/lib/prisma"
import { getCurrentUser, verifyCurrentStudent } from "@/lib/session"

const routeContextSchema = z.object({
  params: z.object({
    conversationId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { conversationId },
  } = routeContextSchema.parse(context)

  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  const student = await db.student.findUnique({
    where: {
      userId: user.id,
    },
  })
  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 })
  }

  try {
    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
    })
    return NextResponse.json(conversation, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const { userId } = await req.json()
  const {
    params: { conversationId },
  } = routeContextSchema.parse(context)
  if (!(await verifyCurrentStudent(userId))) {
    return NextResponse.json(
      { message: "You are not authorized to view this student" },
      { status: 403 }
    )
  }
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  })
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }
  const student = await db.student.findUnique({
    where: {
      userId: user.id,
    },
  })
  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 })
  }
  try {
    const conversation = await db.conversation.delete({
      where: {
        id: conversationId,
        studentId: student.id,
      },
    })
    return NextResponse.json(conversation, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
