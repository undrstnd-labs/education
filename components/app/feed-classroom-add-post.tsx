"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@navigation"
import { Post, File as SupabaseFile, Teacher } from "@prisma/client"
import { useTranslations } from "next-intl"
import { DropzoneOptions } from "react-dropzone"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Classroom } from "@/types/classroom"

import { addPostSchema } from "@/config/schema"
import { uploadFilesClassroom } from "@/lib/storage"
import { useMediaQuery } from "@/hooks/use-media-query"
import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

import { vectorizedDocument } from "@/undrstnd/pinecone"
import { createPost, updatePostFiles } from "@/undrstnd/post"

interface FeedClassroomAddPost {
  teacher: Teacher
  classroom: Classroom
}

function FileSvgDraw({ t }: { t: any }) {
  return (
    <>
      <svg
        className="mb-3 h-8 w-8 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">{t("click-to-select")}</span>
        &nbsp; {t("or-drag-drop")}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t("file-type")}
      </p>
    </>
  )
}

export function FeedClassroomAddPost({
  teacher,
  classroom,
}: FeedClassroomAddPost) {
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

  // TODO: Whenever the teacher posts send an email to all of the students
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const postRes = await fetch(`/api/posts/${classroom.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: "userId",
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

      uploadFilesClassroom(files, classroom, post)
        .then(async (res) => {
          const resUpdate = await fetch(
            `/api/posts/${classroom.id}/${post.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                usedId: "userId",
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
                        className="resize-none"
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

export function FeedClassroomAddPostTrigger({
  teacher,
  classroom,
}: FeedClassroomAddPost) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)

  const t = useTranslations("app.components.app.feed-classroom-add-post")

  const formSchema = addPostSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const dropzone = {
    multiple: true,
    maxFiles: 10,
    maxSize: 25 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  } satisfies DropzoneOptions

  const simulateUpload = (files: File[]) => {
    setProgress(0)

    const totalSize = files.reduce((acc, file) => acc + file.size, 0)
    const uploadTime = totalSize / (250 * 1024)

    let currentSize = 0
    const interval = setInterval(
      () => {
        currentSize += 250 * 1024
        const progress = (currentSize / totalSize) * 100

        setProgress(Math.min(Math.floor(progress), 92))

        if (progress >= 100) {
          clearInterval(interval)
        }
      },
      (uploadTime * 1000) / files.length
    )

    return interval
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    const postCreated = await createPost(classroom, teacher, {
      name: values.name,
      content: values.content,
    })

    if (!postCreated) {
      toast({
        title: t("toastPostCreatedFailed"),
        variant: "destructive",
        description: t("toastPostCreatedFailedDescription"),
      })
      return
    }

    if (values.files) {
      const progress = simulateUpload(values.files)
      const filesUploaded = (await uploadFilesClassroom(
        values.files,
        classroom,
        postCreated
      )) as SupabaseFile[]

      if (!filesUploaded) {
        toast({
          title: t("toastFilesFailed"),
          variant: "destructive",
          description: t("toastFilesFailedDescription"),
        })
        return
      }

      const filesUpdated = await updatePostFiles(
        filesUploaded,
        postCreated,
        classroom
      )

      if (!filesUpdated) {
        toast({
          title: t("toastFilesFailed"),
          variant: "destructive",
          description: t("toastFilesFailedDescription"),
        })
        return
      }

      const pdfFiles = filesUpdated.files.filter(
        (file) => file.type === "application/pdf"
      )

      try {
        await Promise.all(
          pdfFiles.map(async (file) => {
            vectorizedDocument(file.id, {
              ...file,
              url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/files/${file.url}`,
            })
          })
        )
        setProgress(100)
        toast({
          title: t("upload-success"),
        })
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.log(error)
        toast({
          title: t("upload-error"),
          variant: "destructive",
        })
      }

      clearInterval(progress)
      setProgress(0)
    }

    setOpen(false)
    router.refresh()
    form.reset({ files: [] })
    setLoading(false)
  }

  return (
    <ResponsiveDialog
      title={t("create-post")}
      description={t("create-post-description")}
      loading={loading}
      open={open}
      setOpen={setOpen}
      action={() => setOpen(false)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">
                  {t("classroom-name-label")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("classroom-name-placeholder")}
                    {...field}
                    disabled={loading}
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
                  {t("classroom-content-label")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("classroom-content-placeholder")}
                    {...field}
                    rows={2}
                    className="resize-none"
                    disabled={loading}
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
                <FileUploader
                  value={field.value as File[]}
                  onValueChange={field.onChange}
                  dropzoneOptions={dropzone}
                  reSelect={true}
                  className="relative rounded-lg bg-background p-2"
                >
                  <div className="flex w-full flex-col items-center justify-center">
                    <FileInput className="w-full p-4 outline-dashed outline-1 outline-secondary-foreground">
                      <div className="flex flex-col items-center justify-center pb-4 pt-3">
                        <FileSvgDraw t={t} />
                      </div>
                    </FileInput>

                    {field.value && field.value.length > 0 && (
                      <FileUploaderContent className="max-w-xs text-center sm:max-w-md">
                        {field.value.map((file, i) => (
                          <FileUploaderItem
                            uploading={loading}
                            key={i}
                            index={i}
                          >
                            <Icons.paperclip className="h-4 w-4 stroke-current" />
                            <span className="truncate pr-8">{file.name}</span>
                          </FileUploaderItem>
                        ))}
                        {progress != 0 && (
                          <Progress
                            value={progress}
                            className="h-1 w-full bg-zinc-200"
                          />
                        )}
                      </FileUploaderContent>
                    )}
                  </div>
                </FileUploader>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Icons.spinner className="mr-2 size-4 animate-spin" />}
            {t("formClassroomButton")}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  )
}
