"use client"

import { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Teacher } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Classroom, Post } from "@/types/classroom"

import { editPostSchema } from "@/config/schema"
import { uploadFilesClassroom } from "@/lib/storage"
import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { ResponsiveAlertDialog } from "@/components/shared/responsive-alert-dialog"
import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

import {
  createFile,
  deleteFile,
  deletePost,
  updatePost,
  updatePostFiles,
} from "@/undrstnd/post"

interface PostCardOptionsProps {
  post: Post
  teacher: Teacher
  classroom: Classroom
}

export function FeedClassroomPostTeacherActions({
  classroom,
  post,
  teacher,
}: PostCardOptionsProps) {
  const refFiles = useRef<HTMLInputElement>(null)
  const t = useTranslations(
    "app.components.app.feed-classroom-post-teacher-actions"
  )

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setloading] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isModifyOpen, setIsModifyOpen] = useState(false)
  const [files, setFiles] = useState<any[]>(post.files || [])
  const [filesToDelete, setFilesToDelete] = useState<any[]>([])
  const [filesToUpload, setFilesToUpload] = useState<any[]>([])

  const formSchema = editPostSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: post.name || "",
      content: post.content || "",
      files: post.files || [],
    },
  })

  async function handleDelete() {
    setloading(true)

    try {
      const postDeleted = await deletePost(post, classroom, teacher)

      if (postDeleted) {
        toast({
          title: t("toastTitleDeletePost"),
        })
      } else {
        toast({
          title: t("toastTitleDeletePostError"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: t("toastTitleDeletePostError"),
        variant: "destructive",
      })
    }

    setloading(false)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setloading(true)

    await updatePost(post, classroom, teacher, values)

    if (filesToUpload.length > 0) {
      await uploadFilesClassroom(files, classroom, post)
      const createdFiles = await Promise.all(
        filesToUpload.map((file) => createFile(file, post, classroom, teacher))
      )

      const uploaded = await updatePostFiles(createdFiles, post, classroom)
      if (!uploaded) {
        return toast({
          title: t("toastTitleUploadFilesError"),
          variant: "destructive",
        })
      } else {
        toast({
          title: t("toastTitleUploadFiles"),
        })
      }
    }

    if (filesToDelete.length > 0) {
      const filesDeleted = await Promise.all(
        filesToDelete.map((file) => deleteFile(file, post))
      )

      if (!filesDeleted) {
        return toast({
          title: t("toastTitleDeleteFilesError"),
          variant: "destructive",
        })
      }
    }
    setloading(false)
    setIsModifyOpen(false)
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="small-icon"
            className="size-5 max-sm:h-6 max-sm:w-6"
          >
            <Icons.moreHorizontal className="h-4 w-4" />
            <span className="sr-only">Toggle options of post</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("postOption")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => setIsModifyOpen(true)}
          >
            <Icons.editClassroom className="h-4 w-4 " />
            {t("editPost")}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 text-red-600 hover:cursor-pointer"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Icons.deleteClassroom className="h-4 w-4 " />
            {t("deletePost")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveAlertDialog
        title={t("alertDialogTitleDelete")}
        description={t("alertDialogDescriptionDelete")}
        cancelText={t("alertDialogCancel")}
        confirmText={t("alertDialogAction")}
        loading={loading}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        action={handleDelete}
      />

      <ResponsiveDialog
        title={t("dialog-title-edit")}
        description={t("dialog-description-edit")}
        loading={loading}
        open={isModifyOpen}
        setOpen={setIsModifyOpen}
        action={() => ({})}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    {t("formLabelNameAddPost")}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={loading} />
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
                    <Textarea {...field} rows={2} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("formClassroomButton")}
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  )
}
