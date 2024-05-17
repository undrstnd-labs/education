"use client"

import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@navigation"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { UserType } from "@/types/auth"

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

//TODO: Work on the dark theme
export function OnboardingAuthForm({ user }: { user: UserType }) {
  const router = useRouter()
  const { toast } = useToast()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const translateEmailInput = useTranslations("Components.Form.EmailInput")
  const translateOnboarding = useTranslations("Components.Form.OnboardingAuth")

  const university = fetchUniversityData({
    email: user.email!.split("@")[1],
    t: translateEmailInput,
  })

  const form = useForm<z.infer<typeof onboaringSchema>>({
    resolver: zodResolver(onboaringSchema),
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

    let imageUrl
    if (selectedImage) {
      imageUrl = await manageAvatar(selectedImage, user.id)
      setImagePreviewUrl(imageUrl)
    } else {
      imageUrl = `https://avatars.jakerunzer.com/${values.name}`
    }

    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          image: imageUrl,
          universitySlug: user.email!.split("@")[1],
        }),
      })

      if (!res.ok) {
        toast({
          title: translateOnboarding("error-toast-title"),
          variant: "destructive",
        })
      } else {
        router.push("/dashboard")
        toast({
          title: translateOnboarding("success-toast-title"),
          description: translateOnboarding("success-toast-description"),
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="col-span-full">
          <label
            htmlFor="photo"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            {translateOnboarding("photo")}
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            {selectedImage ? (
              <img
                src={imagePreviewUrl}
                alt="Profile image"
                onClick={() => fileInputRef.current?.click()}
                width={48}
                height={48}
                className="size-12 cursor-pointer rounded-full"
              />
            ) : (
              <Icons.user
                className="size-12 cursor-pointer text-gray-400"
                onClick={() => fileInputRef.current?.click()}
              />
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {translateOnboarding("change-image")}
            </button>
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

        <UniversityCard university={university} t={translateOnboarding} />

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
