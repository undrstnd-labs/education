import * as z from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const routeContextSchema = z.object({
  params: z.object({
    classroomId: z.string(),
  }),
});

async function verifyCurrentTeacher(userId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false;
  }
  const count = await db.teacher.count({
    where: {
      userId,
    },
  });

  return count > 0 && session.user.role === "TEACHER";
}
export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const {
      params: { classroomId },
    } = routeContextSchema.parse(context);

    const user = await getCurrentUser();
    if (!(await verifyCurrentTeacher(user?.id!!))) {
      return new Response(null, { status: 403 });
    }

    const teacher = await db.teacher.findUnique({
      where: {
        userId: user?.id,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    const classroom = await db.classroom.findUnique({
      where: {
        id: classroomId,
        teacherId: teacher.id,
      },
    });

    return NextResponse.json(classroom, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const {
      params: { classroomId },
    } = routeContextSchema.parse(context);

    const user = await getCurrentUser();
    if (!(await verifyCurrentTeacher(user?.id!!))) {
      return new Response(null, { status: 403 });
    }

    const teacher = await db.teacher.findUnique({
      where: {
        userId: user?.id,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    const { name, bio } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const classroom = await db.classroom.update({
      where: {
        id: classroomId,
        teacherId: teacher.id,
      },
      data: {
        name,
        bio,
      },
    });

    return NextResponse.json(classroom, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const {
      params: { classroomId },
    } = routeContextSchema.parse(context);

    const user = await getCurrentUser();
    if (!(await verifyCurrentTeacher(user?.id!!))) {
      return new Response(null, { status: 403 });
    }

    const teacher = await db.teacher.findUnique({
      where: {
        userId: user?.id,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { message: "Teacher not found" },
        { status: 404 }
      );
    }

    const classroom = await db.classroom.delete({
      where: {
        id: classroomId,
        teacherId: teacher.id,
      },
    });

    //Todo delete from the students this classroom

    return NextResponse.json(classroom, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
