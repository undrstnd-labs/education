"use server"

import { type FileUpload } from "@/types/file"

import { pinecone } from "@/lib/pinecone"
import { db } from "@/lib/prisma"

export async function getChats(studentId?: string) {
  return db.conversation.findMany({
    where: { studentId },
    orderBy: { updatedAt: "desc" },
  })
}

export async function getChatsWithDetails(studentId: string) {
  return await db.conversation.findMany({
    where: {
      studentId,
      file: {
        is: {
          url: {
            not: undefined,
          },
        },
      },
    },
    include: {
      messages: {
        select: { id: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
      file: true,
    },
  })
}

export async function getChat(id: string, studentId: string) {
  return db.conversation.findFirst({
    where: { id, studentId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
      file: true,
    },
  })
}

export async function removeChat({ id }: { id: string }) {
  const conversation = await db.conversation.findUnique({
    where: {
      id,
    },
    select: {
      file: {
        select: {
          id: true,
          postId: true,
        },
      },
    },
  })

  if (!conversation?.file?.postId) {
    try {
      await Promise.all([
        (async () => {
          const pineconeIndex = pinecone.Index("undrstnd")
          const namespace = pineconeIndex.namespace(id)
          await namespace.deleteAll()
        })(),
        (async () => {
          const conversation = await db.conversation.findUnique({
            where: {
              id,
            },
            select: {
              fileId: true,
            },
          })

          if (conversation?.fileId) {
            await db.file.deleteMany({
              where: {
                id: conversation.fileId,
              },
            })
          }

          await db.conversation.delete({
            where: {
              id,
            },
          })
        })(),
      ])

      return { message: "Chat deleted successfully" }
    } catch (error) {
      return { message: "Chat not found" }
    }
  }

  await db.conversation.delete({
    where: {
      id,
    },
  })

  return { message: "Chat deleted successfully" }
}

export async function saveChat(
  chatId: string,
  studentId: string,
  file: FileUpload,
  path: string
) {
  const createdFile = await saveFile(
    {
      ...file,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${file.url}`,
    },
    studentId
  )

  return db.conversation.create({
    data: {
      id: chatId,
      title: file.name,
      path,
      studentId,
      fileId: createdFile.id,
    },
  })
}

export async function saveFile(file: FileUpload, studentId: string) {
  return db.file.create({
    data: {
      name: file.name,
      type: file.type,
      size: file.size,
      url: file.url,
      studentId,
    },
  })
}
