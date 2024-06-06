"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter } from "@navigation"
import { File as SupabaseFile, Teacher, User } from "@prisma/client"
import { useTranslations } from "next-intl"
import { DropzoneOptions } from "react-dropzone"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Classroom } from "@/types/classroom"

import { addPostSchema } from "@/config/schema"
import { uploadFilesClassroom } from "@/lib/storage"
import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

import { getStudents } from "@/undrstnd/classroom"
import { sendMail } from "@/undrstnd/mailer"
import { vectorizedDocument } from "@/undrstnd/pinecone"
import { createPost, updatePostFiles } from "@/undrstnd/post"

interface FeedClassroomAddPost {
  teacher: Teacher & { user: User }
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
  const path = usePathname()
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
    router.push(`${path}?loading=true`)

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
    form.reset({ files: [] })
    setLoading(false)

    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push(`${path}`)

    const students = await getStudents(classroom)
    for (const student of students) {
      await sendMail("new-post", {
        user: student.user,
        teacherUser: teacher.user,
        classroom,
        post: postCreated,
      })
    }
  }

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="group transition-all hover:cursor-pointer hover:bg-accent"
      >
        <CardContent className="flex  items-center gap-4  px-6 py-3 ">
          <div className="flex size-8 items-center justify-center rounded-full border border-gray-500 hover:bg-accent max-sm:size-5">
            <Icons.add className="size-6 text-gray-500 max-sm:size-4" />
          </div>
          <div className="font-semibold">{t("create-post")}</div>
        </CardContent>
      </Card>

      <ResponsiveDialog
        title={t("create-post")}
        description={t("create-post-description")}
        loading={loading}
        open={open}
        setOpen={setOpen}
        action={() => setOpen(false)}
        buttonExist={false}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-2"
          >
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
              {loading && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              {t("formClassroomButton")}
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  )
}

export function FeedClassroomAddPostTrigger({
  teacher,
  classroom,
}: FeedClassroomAddPost) {
  const router = useRouter()
  const path = usePathname()

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
    router.push(`${path}?loading=true`)

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
    form.reset({ files: [] })
    setLoading(false)

    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push(`${path}`)

    const students = await getStudents(classroom)
    for (const student of students) {
      console.log(teacher, student, classroom, postCreated)
      await sendMail("new-post", {
        user: student.user,
        teacherUser: teacher.user,
        classroom,
        post: postCreated,
      })
    }
  }

  return (
    <ResponsiveDialog
      title={t("create-post")}
      description={t("create-post-description")}
      loading={loading}
      open={open}
      setOpen={setOpen}
      action={() => setOpen(false)}
      buttonExist={true}
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
