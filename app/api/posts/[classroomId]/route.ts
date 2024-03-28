import * as z from "zod";
import { NextResponse } from "next/server";

import { db } from "@lib/prisma";
import { getCurrentUser } from "@lib/session";
import { verifyCurrentUser, verifyCurrentTeacher } from "@lib/session";

const routeContextSchema = z.object({
  params: z.object({
    classroomId: z.string(),
  }),
});

// TODO: Make sure the user (teacher or student) is in the classroom and get all of the posts
export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const {
      params: { classroomId },
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
    const posts = await db.post.findMany({
      where: {
        classroomId,
      },
      include: {
        comments: true,
        reactions: true,
        file: true,
      },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//creating post without file
export async function POST(
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
        { message: "Text is required" },
        { status: 400 }
      );
    }
    const post = await db.post.create({
      data: {
        name,
        content,
        teacherId: teacher.id,
        classroomId,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
