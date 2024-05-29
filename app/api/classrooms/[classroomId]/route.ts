import { NextResponse } from "next/server"
import * as z from "zod"

import { db } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"

const routeContextSchema = z.object({
  params: z.object({
    classroomId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { classroomId },
  } = routeContextSchema.parse(context)

  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 })
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

    try {
      const classroom = await db.classroom.findUnique({
        where: {
          id: classroomId,
          teacherId: teacher.id,
        },
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
          posts: {
            include: {
              teacher: {
                include: {
                  user: true,
                },
              },
              files: true,
              comments: {
                include: {
                  user: true,
                  reactions: true,
                  replies: {
                    include: {
                      user: true,
                      reactions: true,
                    },
                  },
                },
              },
              reactions: true,
            },
          },
        },
      })

      return NextResponse.json(classroom, { status: 200 })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
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

    try {
      const classroom = await db.classroom.findUnique({
        where: {
          isArchived: false,
          id: classroomId,
          students: {
            some: {
              id: student.id,
            },
          },
        },
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
          posts: {
            include: {
              teacher: {
                include: {
                  user: true,
                },
              },
              files: true,
              comments: {
                include: {
                  user: true,
                  reactions: true,
                  replies: {
                    include: {
                      user: true,
                      reactions: true,
                    },
                  },
                },
              },
              reactions: true,
            },
          },
        },
      })

      return NextResponse.json(classroom, { status: 200 })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
}
