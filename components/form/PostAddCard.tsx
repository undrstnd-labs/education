"use client"

import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@navigation"
import { Post } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { classroom } from "@/types/classroom"

import { addPostSchema } from "@/config/schema"
import { uploadFiles } from "@/lib/storage"
import { useMediaQuery } from "@/hooks/use-media-query"
import { toast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer"
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

interface PostAddCard {
  userId: string
  classroom: classroom
}

export function PostAddCard({ userId, classroom }: PostAddCard) {
  const router = useRouter()
  const t = useTranslations("Pages.Classroom")

  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refFiles = useRef<HTMLInputElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const formSchema = addPostSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      content: "",
      files: [],
    },
  })
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }
  const handleFileRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const openFilePicker = () => {
    refFiles.current?.click()
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const postRes = await fetch(`/api/posts/${classroom.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: values.name,
          content: values.content,
        }),
      })

      const post: Post = await postRes.json().catch(() => {
        toast({
          title: t("toastPostCreatedFailed"),
          variant: "destructive",
          description: t("toastPostCreatedFailedDescription"),
        })
        return
      })

      uploadFiles(files, classroom, post)
        .then(async (res) => {
          const resUpdate = await fetch(
            `/api/posts/${classroom.id}/${post.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                files: res.map((file) => {
                  return {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: file.url,
                  }
                }),
              }),
            }
          )

          if (resUpdate.ok) {
            form.reset()
            setFiles([])
            router.refresh()
            toast({
              title: t("toastPostCreatedSuccess"),
              variant: "default",
              description: t("toastPostCreatedSuccessDescription"),
            })
          } else {
            toast({
              title: t("toastPostCreatedFailed"),
              variant: "destructive",
              description: t("toastPostCreatedFailedDescription"),
            })
          }
        })
        .catch(() => {
          toast({
            title: t("toastFilesFailed"),
            variant: "destructive",
            description: t("toastFilesFailedDescription"),
          })
        })
        .finally(() => {
          setOpen(false)
          setIsLoading(false)
        })
    } catch (error) {
      toast({
        title: t("toastPostCreatedFailed"),
        variant: "destructive",
        description: t("toastPostCreatedFailedDescription"),
      })
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className="group transition-all hover:cursor-pointer hover:bg-accent">
            <CardContent className="flex  items-center gap-4  px-6 py-3 ">
              <div className="flex size-8 items-center justify-center rounded-full border border-gray-500 hover:bg-accent max-sm:size-5">
                <Icons.add className="size-6 text-gray-500 max-sm:size-4" />
              </div>
              <div className="group-hover:underline group-hover:underline-offset-2 hover:underline hover:underline-offset-2 max-sm:text-sm ">
                {t("createPostTitle")}
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-8 text-center text-2xl font-bold text-primary">
                {t("createPostTitle")}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelNameAddPost")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("formPlaceholderNameAddPost")}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelDescriptionAddPost")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("formPlaceholderDescriptionAddPost")}
                        {...field}
                        rows={2}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-4">
                      <FormLabel className="font-bold">
                        {t("postFilesLabel")}
                      </FormLabel>
                      <FormControl>
                        <div>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            multiple
                            onChange={handleFileChange}
                            disabled={isLoading}
                            className="hidden"
                            ref={refFiles}
                          />
                          <div
                            className="-mt-1 flex size-6 items-center justify-center rounded-full border border-gray-500 
                            hover:cursor-pointer  hover:bg-accent max-sm:size-5"
                            onClick={openFilePicker}
                          >
                            <Icons.add className="size-5 text-gray-500 max-sm:size-4" />
                          </div>
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage />
                    <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3 ">
                      {files.map((file, index) => (
                        <div key={index} className="relative">
                          <div className=" flex items-center space-x-4 rounded border p-5 shadow-md ">
                            <div className="flex-1 truncate">
                              <div className="text-sm font-bold">
                                {file.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileRemove(index)}
                              className="absolute right-0 top-0 pr-2"
                              disabled={isLoading}
                            >
                              <Icons.close className="mt-1.5 size-4 rounded-full border border-red-300 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t("formClassroomButton")}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Card className="group transition-all hover:cursor-pointer hover:bg-accent">
            <CardContent className="flex  items-center gap-4  px-6 py-3">
              <div className="flex size-8 items-center justify-center rounded-full border border-gray-500 hover:bg-accent max-sm:size-5">
                <Icons.add className="size-6 text-gray-500 max-sm:size-4" />
              </div>
              <div className="group-hover:underline group-hover:underline-offset-2 hover:underline hover:underline-offset-2 max-sm:text-sm">
                {t("createPostTitle")}
              </div>
            </CardContent>
          </Card>
        </DrawerTrigger>
        <DrawerContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-6 pb-6"
            >
              <div className="mb-8 text-center text-2xl font-bold text-primary">
                {t("createPostTitle")}
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelNameAddPost")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("formPlaceholderNameAddPost")}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelDescriptionAddPost")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("formPlaceholderDescriptionAddPost")}
                        {...field}
                        rows={2}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-4">
                      <FormLabel className="font-bold">
                        {t("postFilesLabel")}
                      </FormLabel>
                      <FormControl>
                        <div>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            multiple
                            onChange={handleFileChange}
                            disabled={isLoading}
                            className="hidden"
                            ref={refFiles}
                          />
                          <div
                            className="-mt-1 flex size-6 items-center justify-center rounded-full border border-gray-500 hover:bg-accent max-sm:size-5"
                            onClick={openFilePicker}
                          >
                            <Icons.add className="size-5 text-gray-500 max-sm:size-4" />
                          </div>
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage />
                    <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3 ">
                      {files.map((file, index) => (
                        <div key={index} className="relative">
                          <div className=" flex items-center space-x-4 rounded border p-5 shadow-md ">
                            <div className="flex-1 truncate">
                              <div className="text-sm font-bold">
                                {file.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileRemove(index)}
                              className="absolute right-0 top-0 pr-2"
                              disabled={isLoading}
                            >
                              <Icons.close className="mt-1.5 size-4 rounded-full border border-red-300 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t("formClassroomButton")}
              </Button>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    )
  }
}
