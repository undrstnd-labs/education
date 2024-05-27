"use server"

import { Comment, Post, ReactionType } from "@prisma/client"

import { db } from "@/lib/prisma"

export async function addReactionPost(
  userId: string,
  post: Post,
  type: ReactionType
) {
  return await db.reaction.create({
    data: {
      reactionType: type,
      postId: post.id,
      userId,
    },
  })
}

export async function addReactionComment(
  userId: string,
  comment: Comment,
  type: ReactionType
) {
  return await db.reaction.create({
    data: {
      reactionType: type,
      commentId: comment.id,
      userId,
    },
  })
}

export async function removeReactionPost(
  userId: string,
  reactionId: string,
  post: Post,
  type: ReactionType
) {
  return await db.reaction.delete({
    where: {
      id: reactionId,
      userId,
      postId: post.id,
      reactionType: type,
    },
  })
}

export async function removeReactionComment(
  userId: string,
  reactionId: string,
  comment: Comment,
  type: ReactionType
) {
  return await db.reaction.delete({
    where: {
      id: reactionId,
      userId,
      commentId: comment.id,
      reactionType: type,
    },
  })
}

export async function checkReactionPost(
  userId: string,
  postId: string,
  type: ReactionType
) {
  return await db.reaction.findFirst({
    where: {
      userId,
      postId,
      reactionType: type,
    },
  })
}

export async function checkReactionComment(
  userId: string,
  commentId: string,
  type: ReactionType
) {
  return await db.reaction.findFirst({
    where: {
      userId,
      commentId,
      reactionType: type,
    },
  })
}
