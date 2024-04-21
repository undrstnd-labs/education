import { NextResponse } from "next/server"
import * as z from "zod"

import { db } from "@/lib/prisma"
import { getCurrentUser, verifyCurrentUser } from "@/lib/session"

const routeContextSchema = z.object({
  params: z.object({
    commentId: z.string(),
    postId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { postId, commentId },
  } = routeContextSchema.parse(context)

  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
  }

  try {
    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
        userId: user.id,
        postId,
      },
      include: {
        user: true,
        reactions: true,
      },
    })

    return NextResponse.json(comment, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { postId, commentId },
  } = routeContextSchema.parse(context)
  const { userId, text } = await req.json()
  if (!(await verifyCurrentUser(userId))) {
    return NextResponse.json(
      { message: "You are not authorized to view this user" },
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
  if (!text) {
    return NextResponse.json({ message: "Text is required" }, { status: 400 })
  }
  try {
    const comment = await db.comment.update({
      where: {
        id: commentId,
        postId,
      },
      data: {
        text,
      },
    })

    return NextResponse.json(comment, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { postId, commentId },
  } = routeContextSchema.parse(context)
  const { userId } = await req.json()
  if (!(await verifyCurrentUser(userId))) {
    return NextResponse.json(
      { message: "You are not authorized to view this user" },
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

  try {
    const comment = await db.comment.delete({
      where: {
        id: commentId,
        postId,
      },
    })

    return NextResponse.json(comment, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
