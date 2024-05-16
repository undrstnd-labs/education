"use server"

import { type FileUpload } from "@/types/file"

import { pinecone } from "@/lib/pinecone"
import { db } from "@/lib/prisma"
import { deleteFile } from "@/lib/storage"

export async function getChats(studentId?: string) {
  return db.conversation.findMany({
    where: { studentId },
    orderBy: { updatedAt: "desc" },
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
          const file = await db.file.findUnique({
            where: {
              id: conversation?.fileId,
            },
          })

          if (file) {
            await deleteFile(file.url)
          }

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

export async function saveChat(
  chatId: string,
  studentId: string,
  file: FileUpload,
  path: string
) {
  const createdFile = await saveFile(file, studentId)

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
