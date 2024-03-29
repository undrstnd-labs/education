import * as z from "zod";
import { NextResponse } from "next/server";
import { getCurrentUser, verifyCurrentUser } from "@/lib/session";
import { db } from "@/lib/prisma";

const routeContextSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { postId },
  } = routeContextSchema.parse(context);
  const currentUser = await getCurrentUser();
  if (!(await verifyCurrentUser(currentUser?.id!))) {
    return NextResponse.json(
      { message: "You are not authorized to view this user" },
      { status: 403 }
    );
  }
  const user = await db.user.findUnique({
    where: {
      id: currentUser?.id,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  //TODO : Finding the best querry to get the best practices of the replies and comments
  try {
    const comments = await db.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: true,
        reactions: true,
      },
    });
    return NextResponse.json(comments, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const {
    params: { postId },
  } = routeContextSchema.parse(context);
  const { text, userId, parentId } = await req.json();
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
  const post = await db.post.findUnique({
    where: {
      id: postId,
    },
  });
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }
  if (!text) {
    return NextResponse.json(
      { message: "Comment cannot be empty" },
      { status: 400 }
    );
  }

  try {
    const comment = await db.comment.create({
      data: {
        text,
        userId,
        postId,
        parentId: parentId || null,
      },
    });
    return NextResponse.json(comment, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
