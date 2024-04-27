import { NextResponse } from "next/server"
import * as z from "zod"

import { db } from "@/lib/prisma"
import { verifyCurrentUser } from "@/lib/session"

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
})

export async function PUT(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const { params } = routeContextSchema.parse(context)
  const { name, email, bio, image, universitySlug, role } = await req.json()

  if (!(await verifyCurrentUser(params.userId, true))) {
    return NextResponse.json(
      { message: "You are not authorized to update this user" },
      { status: 403 }
    )
  }

  const user = await db.user.update({
    where: {
      id: params.userId,
    },
    data: {
      name,
      email,
      bio,
      image,
      universitySlug,
      role,
    },
  })

  try {
    if (role === "TEACHER") {
      const teacher = await db.teacher.create({
        data: {
          userId: user.id,
        },
      })

      return NextResponse.json(teacher, { status: 200 })
    }

    if (role === "STUDENT") {
      const student = await db.student.create({
        data: {
          userId: user.id,
        },
      })

      return NextResponse.json(student, { status: 200 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const {
      params: { userId },
    } = routeContextSchema.parse(context)
    if (!(await verifyCurrentUser(userId))) {
      return new Response(null, { status: 403 })
    }
    const user = await db.user.delete({
      where: {
        id: userId,
      },
    })
    if (user.role === "STUDENT") {
      const classrooms = await db.classroom.findMany({
        where: {
          students: {
            some: {
              userId: userId,
            },
          },
        },
      })

      for (const classroom of classrooms) {
        await db.classroom.update({
          where: {
            id: classroom.id,
          },
          data: {
            students: {
              disconnect: {
                userId: userId,
              },
            },
          },
        })
      }
    }
    //FIXME: MAYBE delete from the students this classroom

    return NextResponse.json(user, { status: 200 })
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const { params } = routeContextSchema.parse(context)
  const { name, bio, image } = await req.json()

  if (!(await verifyCurrentUser(params.userId))) {
    return NextResponse.json(
      { message: "You are not authorized to update this user" },
      { status: 403 }
    )
  }

  try {
    const user = await db.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name,
        bio,
        image,
      },
    })

    return NextResponse.json(user, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
