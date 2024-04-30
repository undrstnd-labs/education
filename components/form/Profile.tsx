"use client"

import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@navigation"
import { signOut } from "next-auth/react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { manageAvatar } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog"
import { Button, buttonVariants } from "@/components/ui/Button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Icons } from "@/components/icons/Lucide"

interface ProfileFormProps {
  id: string
  name: string
  bio: string
  image: string
}

const formSchema = z.object({
  name: z.string().min(2).max(50),
  bio: z.string().max(200).optional(),
  image: z.string().url().optional(),
})

const Profile = ({ bio, image, name, id }: ProfileFormProps) => {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const translateOnboarding = useTranslations("Components.Form.OnboardingAuth")
  const t = useTranslations("Components.Display.Profile")
  const isDesktop = useMediaQuery("(min-width: 768px)")

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name, image, bio },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    let imageUrl = values.image
    if (selectedImage) {
      try {
        imageUrl = await manageAvatar(selectedImage, id)
        setImagePreviewUrl(imageUrl)
      } catch (error) {
        console.error(error)
        toast({
          title: "Failed to upload image",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
    } else {
      imageUrl = image || `https://avatars.jakerunzer.com/${values.name}`
    }

    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          bio: values.bio,
          image: imageUrl,
        }),
      })

      if (!res.ok) {
        toast({
          title: "Failed to update profile",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleDelete = async () => {
    signOut()
    const res = await fetch(`/api/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res.ok) {
      toast({
        title: "Profile deleted",
        description: "Your profile has been deleted successfully.",
      })
      router.push("/login")
    }
  }

  return (
    <>
      <Form {...form}>
        <div className="col-span-full w-full px-4">
          <div className="flex items-center justify-between">
            <div>
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
                  <img
                    src={image || `https://avatars.jakerunzer.com/${name}`}
                    alt="Profile image"
                    onClick={() => fileInputRef.current?.click()}
                    width={48}
                    height={48}
                    className="size-12 cursor-pointer rounded-full"
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
            <div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 "
                onClick={() => setIsOpen(true)}
              >
                <Icons.trash className="h-5 w-5 text-red-500" />
                <span className="sr-only">Delete Profile</span>
              </Button>
            </div>
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full  space-y-2 "
          >
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

            <button
              type="submit"
              className={cn(buttonVariants(), "w-full")}
              disabled={loading}
            >
              {loading && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              {translateOnboarding("submit")}{" "}
              <Icons.chevronRight className="ml-2 size-4 stroke-[3px]" />
            </button>
          </form>
        </div>
      </Form>
      {isOpen && isDesktop ? (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("alertDialogTitleDelete")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("alertDialogDescriptionDelete")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("alertDialogCancel")}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-700 hover:bg-red-500"
                onClick={handleDelete}
              >
                {t("alertDialogAction")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="pb-2">
            <DrawerHeader className="text-left">
              <DrawerTitle>{t("alertDialogTitleDelete")}</DrawerTitle>
              <DrawerDescription>
                {t("alertDialogDescriptionDelete")}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="bg-red-700 text-white hover:bg-red-500"
                  onClick={handleDelete}
                >
                  {t("alertDialogCancel")}
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline"> {t("alertDialogAction")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

export default Profile
