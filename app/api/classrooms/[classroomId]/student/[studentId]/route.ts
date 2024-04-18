import * as z from "zod";
import { NextResponse } from "next/server";

import { db } from "@lib/prisma";

const routeContextSchema = z.object({
  params: z.object({
    classroomId: z.string(),
    studentId: z.string(),
  }),
});

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { classroomId, studentId },
  } = routeContextSchema.parse(context);

  try {
    const classroom = await db.classroom.findUnique({
      where: {
        isArchived: false,
        id: classroomId,
        students: {
          some: {
            id: studentId,
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
    });

    return NextResponse.json(classroom, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
