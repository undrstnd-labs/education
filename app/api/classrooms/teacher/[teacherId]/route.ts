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
          posts: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              comments: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(classrooms, { status: 200 })
}
