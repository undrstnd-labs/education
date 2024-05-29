import { Post } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

import { Classroom } from "@/types/classroom"
import { supabaseFile } from "@/types/supabase"

import { supabase } from "@/lib/supabase"

export async function uploadAvatar(file: File, userId: string) {
  return await supabase.storage
    .from("avatar")
    .upload(userId + "/avatar.png", file)
}

export async function deleteAvatar(userId: string) {
  return await supabase.storage.from("avatar").remove([userId + "/avatar.png"])
}

export async function getAvatarDownloadUrl(userId: string) {
  return await supabase.storage.from("avatar").list(userId)
}

export async function manageAvatar(file: File, userId: string) {
  if (
    await getAvatarDownloadUrl(userId).then(
      (res) => res.data && res.data.length > 0
    )
  ) {
    deleteAvatar(userId)
  }

  await uploadAvatar(file, userId)

  const { data, error } = await getAvatarDownloadUrl(userId)
  if (error) {
    throw error
  }

  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL +
    "/storage/v1/object/public/avatar/" +
    userId +
    "/avatar.png"
  )
}

export async function uploadFilesClassroom(
  files: File[],
  classroom: Classroom,
  post: Post
): Promise<supabaseFile[]> {
  const uploadedFiles: supabaseFile[] = []
  const uploadPromises = files.map(async (file) => {
    const { data, error } = await supabase.storage
      .from("files")
      .upload(
        `/classrooms/${classroom.id}/${post.id}/${uuidv4()}.${file.name.split(".")[1]}`,
        file
      )

    if (error) {
      throw error
    }

    const uploadedFile: supabaseFile = {
      name: file.name,
      url: data.path,
      type: file.type,
      size: file.size,
    }

    uploadedFiles.push(uploadedFile)
  })

  await Promise.all(uploadPromises)

  return uploadedFiles
}

export async function uploadFilesStudent(
  file: File,
  studentId: string,
  conversationId: string
) {
  const { data, error } = await supabase.storage
    .from("files")
    .upload(
      `/students/${studentId}/${conversationId}/${uuidv4()}.${file.name.split(".")[1]}`,
      file
    )

  if (error) {
    throw error
  }

  return {
    name: file.name,
    url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${data.path}`,
    type: file.type,
    size: file.size,
  }
}

export async function deleteFiles(filesUrl: string[]) {
  await Promise.all(
    filesUrl.map(async (fileUrl) => {
      await supabase.storage.from("files").remove([fileUrl])
    })
  )
}

export async function deleteFile(fileUrl: string) {
  await supabase.storage
    .from("files")
    .remove([
      fileUrl.split(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/`
      )[1],
    ])
}

export const downloadFileFromUrl = async (url: string) => {
  try {
    const { data, error } = await supabase.storage.from("files").download(url)

    if (error) {
      throw error
    }

    const blob = new Blob([data], { type: "application/octet-stream" })

    const downloadLink = document.createElement("a")
    downloadLink.href = window.URL.createObjectURL(blob)
    downloadLink.download = url.split("/").pop() ?? ""
    downloadLink.click()
  } catch (err) {
    console.error("Erreur lors du téléchargement du fichier :", err)
  }
}
