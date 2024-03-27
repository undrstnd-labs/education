import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { classroomId } }: { params: { classroomId: string } }
) {
  try {
    if (!classroomId)
      return NextResponse.json(
        { message: "Classroom Id is required" },
        { status: 400 }
      );

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "TEACHER") {
      return NextResponse.json(
        { message: "Only teacher can make this request" },
        { status: 401 }
      );
    }
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
  { params: { classroomId } }: { params: { classroomId: string } }
) {
  try {
    if (!classroomId)
      return NextResponse.json(
        { message: "Classroom Id is required" },
        { status: 400 }
      );

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "TEACHER") {
      return NextResponse.json(
        { message: "Only teacher can make this request" },
        { status: 401 }
      );
    }
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
  { params: { classroomId } }: { params: { classroomId: string } }
) {
  try {
    if (!classroomId)
      return NextResponse.json(
        { message: "Classroom Id is required" },
        { status: 400 }
      );

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "TEACHER") {
      return NextResponse.json(
        { message: "Only teacher can make this request" },
        { status: 401 }
      );
    }
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
