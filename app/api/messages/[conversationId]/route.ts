import * as z from "zod";
import { NextResponse } from "next/server";

import { db } from "@lib/prisma";
import { getCurrentUser, verifyCurrentStudent } from "@lib/session";

const routeContextSchema = z.object({
  params: z.object({
    conversationId: z.string(),
  }),
});

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { conversationId },
  } = routeContextSchema.parse(context);

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (user.role !== "STUDENT") {
    return NextResponse.json(
      { message: "You are not authorized to view this user" },
      { status: 403 }
    );
  }
  const student = await db.student.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }

  const conversation = await db.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { message: "Conversation not found" },
      { status: 404 }
    );
  }

  try {
    const messages = await db.message.findMany({
      where: {
        conversationId: conversationId,
      },
    });
    return NextResponse.json(messages, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { conversationId },
  } = routeContextSchema.parse(context);
  const { userId, text, messageSource } = await req.json();

  if (!verifyCurrentStudent(userId)) {
    return NextResponse.json(
      { message: "You are not authorized to create a message" },
      { status: 403 }
    );
  }
  const student = await db.student.findUnique({
    where: {
      userId,
    },
  });
  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }
  const conversation = await db.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { message: "Conversation not found" },
      { status: 404 }
    );
  }
  if (!text) {
    return NextResponse.json(
      { message: "Message text is required" },
      { status: 400 }
    );
  }

  if (!messageSource) {
    return NextResponse.json(
      { message: "Message source is required" },
      { status: 400 }
    );
  }

  try {
    const message = await db.message.create({
      data: {
        text,
        conversationId,
        messageSource,
      },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
