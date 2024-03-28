import * as z from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const routeContextSchema = z.object({
  params: z.object({
    classroomId: z.string(),
    postId: z.string(),
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

async function verifyCurrentUser(userId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false;
  }
  const count = await db.teacher.count({
    where: {
      userId,
    },
  });

  return count > 0 && session.user.role !== "NOT_ASSIGNED";
}

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const {
      params: { classroomId, postId },
    } = routeContextSchema.parse(context);

    const user = await getCurrentUser();
    if (!(await verifyCurrentUser(user?.id!!))) {
      return new Response(null, { status: 403 });
    }
    const classroom = await db.classroom.findUnique({
      where: {
        id: classroomId,
      },
    });
    if (!classroom) {
      return NextResponse.json(
        { message: "Classroom not found" },
        { status: 404 }
      );
    }
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: true,
        reactions: true,
        file: true,
      },
    });
    return NextResponse.json(post, { status: 200 });
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
      params: { classroomId, postId },
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
      },
    });
    if (!classroom) {
      return NextResponse.json(
        { message: "Classroom not found" },
        { status: 404 }
      );
    }
    const { name, content } = await req.json();
    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }
    if (!content) {
      return NextResponse.json(
        { message: "content is required" },
        { status: 400 }
      );
    }
    const post = await db.post.update({
      where: {
        id: postId,
        teacherId: teacher.id,
      },
      data: {
        name,
        content,
      },
    });

    return NextResponse.json(post, { status: 200 });
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
      params: { classroomId, postId },
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
      },
    });
    if (!classroom) {
      return NextResponse.json(
        { message: "Classroom not found" },
        { status: 404 }
      );
    }

    const post = await db.post.delete({
      where: {
        id: postId,
        teacherId: teacher.id,
      },
    });
    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
