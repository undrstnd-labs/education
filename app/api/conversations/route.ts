import { NextResponse } from "next/server"

import { db } from "@/lib/prisma"
import { getCurrentUser, verifyCurrentStudent } from "@/lib/session"

export async function GET(req: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }
  if (user.role !== "STUDENT") {
    return NextResponse.json(
      { message: "You are not authorized to view this user" },
      { status: 403 }
    )
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
    const conversations = await db.conversation.findMany({
      where: {
        studentId: student.id,
      },
      include: {
        messages: true,
      },
    })
    return NextResponse.json(conversations, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
