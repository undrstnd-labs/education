import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    console.log(user?.id);
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
    const classrooms = await db.classroom.findMany({
      where: {
        teacherId: teacher.id,
      },
    });
    return NextResponse.json(classrooms, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
    const classroom = await db.classroom.create({
      data: {
        name,
        bio,
        teacherId: teacher.id,
      },
    });
    return NextResponse.json(classroom, { status: 201 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
