import { db } from "@/lib/prisma";
import { verifyCurrentTeacher } from "@/lib/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const routeContextSchema = z.object({
  params: z.object({
    classroomId: z.string(),
  }),
});

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const { userId, isArchived } = await req.json();
  const {
    params: { classroomId },
  } = routeContextSchema.parse(context);

  if (!(await verifyCurrentTeacher(userId))) {
    return NextResponse.json(
      { message: "You are not authorized to archive this classroom" },
      { status: 403 }
    );
  }

  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const teacher = await db.teacher.findUnique({
    where: {
      userId,
    },
  });

  if (!teacher) {
    return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
  }

  try {
    const classroom = await db.classroom.update({
      where: {
        id: classroomId,
        teacherId: teacher.id,
      },
      data: {
        isArchived,
      },
    });
    const students = await db.student.findMany({
      where: {
        classrooms: {
          some: {
            id: classroomId,
          },
        },
      },
    });
    for (const student of students) {
      await db.student.update({
        where: {
          id: student.id,
        },
        data: {
          classrooms: {
            disconnect: {
              id: classroomId,
            },
          },
        },
      });
    }

    return NextResponse.json(classroom, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
