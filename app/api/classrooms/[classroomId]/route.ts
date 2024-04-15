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
  const {
    params: { classroomId },
  } = routeContextSchema.parse(context);

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

    try {
      const classroom = await db.classroom.findUnique({
        where: {
          id: classroomId,
          teacherId: teacher.id,
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
      const classroom = await db.classroom.findUnique({
        where: {
          isArchived: false,
          id: classroomId,
          students: {
            some: {
              id: student.id,
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
}

export async function PUT(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const { userId, name, description } = await req.json();
  const {
    params: { classroomId },
  } = routeContextSchema.parse(context);

  if (!(await verifyCurrentTeacher(userId))) {
    return NextResponse.json(
      { message: "You are not authorized to update this classroom" },
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
        name,
        description,
      },
    });

    return NextResponse.json(classroom, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const { userId } = await req.json();
  const {
    params: { classroomId },
  } = routeContextSchema.parse(context);

  if (!(await verifyCurrentTeacher(userId))) {
    return NextResponse.json(
      { message: "You are not authorized to delete this classroom" },
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
    const classroom = await db.classroom.delete({
      where: {
        id: classroomId,
        teacherId: teacher.id,
      },
    });

    //FIXME: MAYBE delete from the students this classroom
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

    return NextResponse.json(classroom, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
