"use server"

import { db } from "@/lib/prisma"

export async function createComment(
  userId: string,
  postId: string,
  text: string,
  parentId?: string
) {
  return await db.comment.create({
    data: {
      text,
      userId,
      postId,
      parentId: parentId || null,
    },
  })
}

export async function updateComment(
  postId: string,
  commentId: string,
  text: string,
  parentId: string | null
) {
  return await db.comment.update({
    where: {
      id: commentId,
      postId,
    },
    data: {
      text,
      parentId,
    },
  })
}

export async function deleteComment(postId: string, commentId: string) {
  return await db.comment.delete({
    where: {
      id: commentId,
      postId,
    },
  })
}

export async function getComment(postId: string, commentId: string) {
  return await db.comment.findFirst({
    where: {
      postId,
      id: commentId,
    },
    include: {
      user: true,
    },
  })
}
