import * as z from "zod";
import { getServerSession } from "next-auth";

import { db } from "@lib/prisma";
import { authOptions } from "@lib/auth";
import { NextResponse } from "next/server";

async function verifyCurrentUser(userId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false;
  }

  const count = await db.user.count({
    where: {
      id: userId,
    },
  });

  return count > 0;
}

const routeContextSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
});

export async function PUT(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const { params } = routeContextSchema.parse(context);
  const { name, email, bio, image, universitySlug, role } = await req.json();

  if (!(await verifyCurrentUser(params.userId))) {
    return new Response(null, { status: 403 });
  }

  const user = await db.user.update({
    where: {
      id: params.userId,
    },
    data: {
      name,
      email,
      bio,
      image,
      universitySlug,
      role,
    },
  });

  if (role === "TEACHER") {
    const teacher = await db.teacher.create({
      data: {
        userId: params.userId,
      },
    });
  }
  if (role === "STUDENT") {
    const student = await db.student.create({
      data: {
        userId: params.userId,
      },
    });
  }
  return new Response(JSON.stringify(user), {
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const {
      params: { userId },
    } = routeContextSchema.parse(context);
    if (!(await verifyCurrentUser(userId))) {
      return new Response(null, { status: 403 });
    }
    const user = await db.user.delete({
      where: {
        id: userId,
      },
    });
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
