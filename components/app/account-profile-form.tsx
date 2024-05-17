"use client"

import React, { useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "@navigation"
import { User } from "@prisma/client"
import { useTranslations } from "next-intl"

import { manageAvatar } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"

import { updateProfileImage } from "@/undrstnd/user"

export function AccountProfileForm({ user }: { user: User }) {
  const router = useRouter()
  const { toast } = useToast()

  const t = useTranslations("app.components.app.account-profile-form")

  const [loading, setLoading] = useState(false)
  const [showIcon, setShowIcon] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file && file.size < 3000000) {
      setSelectedImage(file)
      setImagePreviewUrl(URL.createObjectURL(file))
    } else {
      toast({
        title: t("image-too-large"),
        description: t("image-description-error"),
        variant: "destructive",
      })

      e.target.value = ""
      setSelectedImage(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    if (selectedImage) {
      const imageUrl = await manageAvatar(selectedImage, user.id)
      setImagePreviewUrl(imageUrl)

      const userUpdated = await updateProfileImage(imageUrl, user)

      if (userUpdated) {
        toast({
          title: t("image-uploaded"),
        })
      } else {
        toast({
          title: t("image-upload-failed"),
          variant: "destructive",
        })
      }

      setSelectedImage(null)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      {selectedImage ? (
        <div className="relative inline-block">
          <img
            src={imagePreviewUrl}
            alt="Profile image"
            onClick={() => fileInputRef.current?.click()}
            width={300}
            height={300}
            className="size-32 cursor-pointer rounded-full border-2 border-secondary-foreground/50 object-cover"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`absolute inset-0 flex cursor-pointer items-center justify-center ${
              showIcon ? "opacity-100" : "opacity-0"
            } rounded-full bg-secondary-foreground/70 bg-opacity-50 transition-opacity duration-200`}
            onMouseEnter={() => {
              setShowIcon(true)
            }}
            onMouseLeave={() => {
              setShowIcon(false)
            }}
          >
            <Icons.media className="h-6 w-6 text-secondary" />
          </div>
        </div>
      ) : (
        <>
          <div className="relative inline-block">
            <Image
              src={`${user.image}?${Date.now()}`}
              alt="Profile image"
              onClick={() => fileInputRef.current?.click()}
              className="size-32 cursor-pointer rounded-full border-2 border-secondary-foreground/50 object-cover"
              width={300}
              height={300}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`absolute inset-0 flex cursor-pointer items-center justify-center ${
                showIcon ? "opacity-100" : "opacity-0"
              } rounded-full bg-secondary-foreground/70 bg-opacity-50 transition-opacity duration-200`}
              onMouseEnter={() => {
                setShowIcon(true)
              }}
              onMouseLeave={() => {
                setShowIcon(false)
              }}
            >
              <Icons.media className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </>
      )}
      <CardFooter className="border-t px-0 pb-0 pt-4">
        <Button type="submit" disabled={loading}>
          {loading && <Icons.loader className="mr-2 size-3 animate-spin" />}
          {t("save")}
        </Button>
      </CardFooter>
    </form>
  )
}
