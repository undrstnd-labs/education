import * as z from "zod";
import { NextResponse } from "next/server";

import { db } from "@lib/prisma";
import { verifyCurrentUser } from "@lib/session";

const routeContextSchema = z.object({
  params: z.object({
    reactionId: z.string(),
  }),
});

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { reactionId },
  } = routeContextSchema.parse(context);
  const { userId } = await req.json();
  if (!(await verifyCurrentUser(userId))) {
    return NextResponse.json(
      { message: "You are not authorized to view this user" },
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
  const reaction = await db.reaction.findUnique({
    where: {
      id: reactionId,
    },
  });

  if (!reaction) {
    return NextResponse.json(
      { message: "Reaction not found" },
      { status: 404 }
    );
  }

  if (reaction.userId !== user.id) {
    return NextResponse.json(
      { message: "You are not authorized to delete this reaction" },
      { status: 403 }
    );
  }

  try {
    await db.reaction.delete({
      where: {
        id: reactionId,
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Reaction deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
