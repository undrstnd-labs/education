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
