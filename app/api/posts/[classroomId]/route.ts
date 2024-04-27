import * as z from "zod";
import { NextResponse } from "next/server";

import { db } from "@lib/prisma";
import { getCurrentUser } from "@lib/session";
import { verifyCurrentTeacher } from "@lib/session";

const routeContextSchema = z.object({
  params: z.object({
    classroomId: z.string(),
  }),
});

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const {
      params: { classroomId },
    } = routeContextSchema.parse(context);

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
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

    if (user.role === "TEACHER") {
      const teacher = await db.teacher.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!teacher) {
        return NextResponse.json(
          { message: "Teacher not found" },
          { status: 404 }
        );
      }

      if (teacher.id !== classroom.teacherId) {
        return NextResponse.json(
          { message: "Teacher is not in the classroom" },
          { status: 403 }
        );
      }
    }

    if (user.role === "STUDENT") {
      const student = await db.student.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!student) {
        return NextResponse.json(
          { message: "Student not found" },
          { status: 404 }
        );
      }

      const classroomStudent = await db.classroom.findFirst({
        where: {
          id: classroomId,
          students: {
            some: {
              id: student.id,
            },
          },
        },
      });

      if (!classroomStudent) {
        return NextResponse.json(
          { message: "Student is not in the classroom" },
          { status: 403 }
        );
      }
    }

    const posts = await db.post.findMany({
      where: {
        classroomId,
      },
      include: {
        files: true,
        comments: true,
        reactions: true,
      },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const { userId, name, content } = await req.json();
  const {
    params: { classroomId },
  } = routeContextSchema.parse(context);

  if (!name || !content) {
    return NextResponse.json(
      {
        message: "All fileds are required",
      },
      {
        status: 400,
      }
    );
  }

  if (!(await verifyCurrentTeacher(userId))) {
    return NextResponse.json(
      { message: "You are not authorized to update this classroom" },
      { status: 403 }
    );
  }

  const teacher = await db.teacher.findUnique({
    where: {
      userId,
    },
  });

  if (!teacher) {
    return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
  }

  const classroom = await db.classroom.findUnique({
    where: {
      id: classroomId,
      teacherId: teacher.id,
    },
  });

  if (!classroom) {
    return NextResponse.json(
      { message: "Classroom not found" },
      { status: 404 }
    );
  }

  try {
    const post = await db.post.create({
      data: {
        name,
        content,
        classroomId,
        teacherId: teacher.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
