import { NextResponse } from "next/server";

import { db } from "@lib/prisma";
import { verifyCurrentUser } from "@lib/session";

export async function POST(req: Request) {
  const { userId, postId, commentId, reactionType } = await req.json();

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

  if (!reactionType) {
    return NextResponse.json(
      { message: "Reaction type is required" },
      { status: 400 }
    );
  }
  try {
    if (postId) {
      const reaction = await db.reaction.create({
        data: {
          reactionType,
          postId,
          userId,
        },
      });
      return NextResponse.json(reaction, { status: 201 });
    } else if (commentId) {
      const reaction = await db.reaction.create({
        data: {
          reactionType,
          commentId,
          userId,
          postId: null,
        },
      });
      return NextResponse.json(reaction, { status: 201 });
    } else {
      return NextResponse.json(
        { message: "postId or commentId is required" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
