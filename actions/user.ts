"use server"

import { User } from "@prisma/client"

import { db } from "@/lib/prisma"

export async function updateProfileImage(imageUrl: string, user: User) {
  return db.user.update({
    where: {
      id: user.id,
    },
    data: {
      image: imageUrl,
    },
  })
}
