"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@navigation"
import { User } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { onboaringSchema } from "@/config/schema"
import { fetchUniversityData } from "@/config/universities"
import { manageAvatar } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

import { UniversityCard } from "@/components/display/UniversityCard"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { updateProfileImage, updateUserOnboarding } from "@/undrstnd/user"

export function AuthOnboaringForm({ user }: { user: User }) {
  const router = useRouter()
  const { toast } = useToast()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const userImage = user.image
    ? user.image
    : `https://avatars.jakerunzer.com/${user.email}`

  const [loading, setLoading] = useState(false)
  const [showIcon, setShowIcon] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const translateEmailInput = useTranslations(
    "app.components.app.auth-input-university-form"
  )
  const translateOnboarding = useTranslations(
    "app.components.app.auth-onboarding-form"
  )

  const university = fetchUniversityData({
    email: user.email!.split("@")[1],
    t: translateEmailInput,
  })

  const form = useForm<z.infer<typeof onboaringSchema>>({
    resolver: zodResolver(onboaringSchema),
    defaultValues: {
      name: user.name || "",
      image: userImage,
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file && file.size < 3000000) {
      setSelectedImage(file)
      setImagePreviewUrl(URL.createObjectURL(file))
    } else {
      toast({
        title: translateOnboarding("image-too-large"),
        description: translateOnboarding("image-description-error"),
        variant: "destructive",
      })

      e.target.value = ""
      setSelectedImage(null)
    }
  }

  async function onSubmit(values: z.infer<typeof onboaringSchema>) {
    setLoading(true)

    if (selectedImage) {
      const imageUrl = await manageAvatar(selectedImage, user.id)
      setImagePreviewUrl(imageUrl)

      const userUpdated = await updateProfileImage(imageUrl, user)

      if (!userUpdated) {
        toast({
          title: translateOnboarding("image-upload-failed"),
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      setSelectedImage(null)
    }

    const updatedUser = await updateUserOnboarding(user, values)

    if (!updatedUser) {
      toast({
        title: translateOnboarding("error-toast-title"),
        variant: "destructive",
      })
    } else {
      router.push("/feed")
      toast({
        title: translateOnboarding("success-toast-title"),
        description: translateOnboarding("success-toast-description"),
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                    src={`${userImage}?${Date.now()}`}
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

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translateOnboarding("name")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={translateOnboarding("placeholderName")}
                  {...field}
                />
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
              <FormLabel>{translateOnboarding("bio")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={translateOnboarding("placeholderBio")}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translateOnboarding("role")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={translateOnboarding("placeholderRole")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STUDENT">
                    {translateOnboarding("student")}
                  </SelectItem>
                  <SelectItem value="TEACHER">
                    {translateOnboarding("teacher")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {user.universitySlug && (
          <UniversityCard university={university} t={translateOnboarding} />
        )}

        <button
          type="submit"
          className={cn(buttonVariants(), "w-full")}
          disabled={loading}
        >
          {loading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
          {translateOnboarding("submit")}{" "}
          <Icons.chevronRight className="ml-2 size-4 stroke-[3px]" />
        </button>
      </form>
    </Form>
  )
}
