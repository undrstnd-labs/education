import { NextResponse } from "next/server";

import { db } from "@lib/prisma";
import { getCurrentUser, verifyCurrentTeacher } from "@lib/session";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
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

    const classrooms = await db.classroom.findMany({
      where: {
        teacherId: teacher.id,
      },
    });

    return NextResponse.json(classrooms, { status: 200 });
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

    try {
      const classrooms = await db.classroom.findMany({
        where: {
          isArchived: false,
          students: {
            some: {
              id: student.id,
            },
          },
        },
      });

      return NextResponse.json(classrooms, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Error fetching classrooms" },
        { status: 500 }
      );
    }
  }
}

export async function POST(req: Request) {
  const { userId, name, description } = await req.json();

  if (!(await verifyCurrentTeacher(userId))) {
    return NextResponse.json(
      { message: "You are not authorized to create a classroom" },
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

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  try {
    const classroom = await db.classroom.create({
      data: {
        name,
        description,
        classCode: Math.random().toString(36).substring(2, 10),
        teacherId: teacher.id,
      },
    });

    return NextResponse.json(classroom, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating classroom" },
      { status: 500 }
    );
  }
}
