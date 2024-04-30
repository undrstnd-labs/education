"use server"

import { redirect } from "@navigation"
import { z } from "zod"

import { type FileUpload } from "@/types/file"

import { pinSchema } from "@/config/schema"
import { db } from "@/lib/prisma"
import { deleteFile } from "@/lib/storage"

export async function verifyPassCode(form: z.infer<typeof pinSchema>) {
  const data = pinSchema.parse({
    email: form.email,
    pin: form.pin,
  })

  const fetchToken = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/token/${data.email}`,
    {
      next: {
        revalidate: 0,
      },
    }
  ).then((res) => res.json())

  return {
    status: data.pin === fetchToken.passCode,
    url: data.pin === fetchToken.passCode ? fetchToken.verificationUrl : "",
  }
}

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
    },
  })
}

export async function removeChat({ id }: { id: string }) {
  const conversation = await db.conversation.findUnique({
    where: {
      id,
    },
    select: {
      fileId: true,
    },
  })

  // now let's delete the file from storage

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

  try {
    return db.conversation.delete({
      where: {
        id,
      },
    })
  } finally {
    return { message: "Chat not found" }
  }
}

export async function clearChats() {
  // TODO: Clear all chats
}

export async function getSharedChat(id: string) {
  // TODO: Get a shared chat
}

export async function shareChat(id: string) {}

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

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  const keysRequired = ["GROQ_API_KEY"]
  return keysRequired
    .map((key) => (process.env[key] ? "" : key))
    .filter((key) => key !== "")
}
