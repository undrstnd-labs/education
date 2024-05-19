"use server"

import { Classroom, File, Post, Teacher } from "@prisma/client"

import { db } from "@/lib/prisma"
import { generateUuid } from "@/lib/utils"

export async function createPost(
  classroom: Classroom,
  teacher: Teacher,
  data: { name: string; content: string }
) {
  return await db.post.create({
    data: {
      name: data.name,
      content: data.content,
      classroomId: classroom.id,
      teacherId: teacher.id,
    },
  })
}

export async function updatePostFiles(
  files: File[],
  post: Post,
  classroom: Classroom
) {
  return await db.post.update({
    where: {
      id: post.id,
      classroomId: classroom.id,
    },
    data: {
      files: {
        create: files.map((file) => ({
          id: generateUuid(),
          size: file.size,
          name: file.name,
          type: file.type,
          url: file.url,
        })),
      },
    },
    include: {
      files: true,
    },
  })
}

export async function deletePost(
  post: Post,
  classroom: Classroom,
  teacher: Teacher
) {
  return await db.post.delete({
    where: {
      id: post.id,
      classroomId: classroom.id,
      teacherId: teacher.id,
    },
  })
}

export async function updatePost(
  post: Post,
  classroom: Classroom,
  teacher: Teacher,
  data: { name: string; content: string }
) {
  return await db.post.update({
    where: {
      id: post.id,
      classroomId: classroom.id,
      teacherId: teacher.id,
    },
    data: {
      name: data.name,
      content: data.content,
    },
  })
}

export async function createFile(
  file: File,
  post: Post,
  classroom: Classroom,
  teacher: Teacher
) {
  return await db.file.create({
    data: {
      id: generateUuid(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: file.url,
      postId: post.id,
    },
  })
}

export async function deleteFile(file: File, post: Post) {
  return await db.file.delete({
    where: {
      id: file.id,
      postId: post.id,
    },
  })
}
