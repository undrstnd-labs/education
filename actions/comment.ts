"use server"

import { db } from "@/lib/prisma"

export async function createComment(
  userId: string,
  postId: string,
  text: string,
  parentId?: string
) {
  const comment = await db.comment.create({
    data: {
      text,
      userId,
      postId,
      parentId: parentId || null,
    },
  })
  return comment
}

export async function updateComment(
  postId: string,
  commentId: string,
  text: string,
  parentId: string | null
) {
  const comment = await db.comment.update({
    where: {
      id: commentId,
      postId,
    },
    data: {
      text,
      parentId,
    },
  })
  return comment
}

export async function deleteComment(postId: string, commentId: string) {
  const comment = await db.comment.delete({
    where: {
      id: commentId,
      postId,
    },
  })
  return comment
}
