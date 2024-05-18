"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@navigation"
import { User } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { manageAvatar } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { updateProfileImage, updateUser } from "@/undrstnd/user"

interface ProfileFormProps {
  user: User
}

const formSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(200).optional(),
  image: z.string().url().optional(),
})

export function AccountProfileForm({ user }: ProfileFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showIcon, setShowIcon] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations("app.components.app.account-profile-form")

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: `${user.name}`,
      bio: `${user.bio}`,
      image: user.image || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    if (selectedImage) {
      const imageUrl = await manageAvatar(selectedImage, user.id)
      setImagePreviewUrl(imageUrl)

      const userUpdated = await updateProfileImage(imageUrl, user)

      if (!userUpdated) {
        toast({
          title: t("image-upload-failed"),
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      setSelectedImage(null)
    }

    const updatedUser = await updateUser(user, {
      name: values.name,
      bio: values.bio,
    })

    if (updatedUser) {
      toast({
        title: t("profile-updated"),
      })
    } else {
      toast({
        title: t("profile-no-updated"),
        variant: "destructive",
      })
    }

    router.refresh()
    setLoading(false)
  }

  return (
    <Form {...form}>
      <div className="col-span-full w-full px-4">
        <div className="flex items-center justify-between">
          <div className="mt-2 flex items-center gap-x-3">
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
          </div>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">{t("name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholderName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">{t("bio")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("placeholderBio")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-t px-0 pt-4">
            <button
              type="submit"
              className={cn(buttonVariants(), "w-full")}
              disabled={loading}
            >
              {loading && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              {t("submit")}{" "}
              <Icons.chevronRight className="ml-2 size-4 stroke-[3px]" />
            </button>
          </div>
        </form>
      </div>
    </Form>
  )
}
