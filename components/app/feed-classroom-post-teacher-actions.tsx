"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
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

    const postDeleted = await deletePost(post, classroom, teacher)

    if (postDeleted) {
      toast({
        title: t("toastTitleDeletePost"),
      })
      router.refresh()
    } else {
      toast({
        title: t("toastTitleDeletePostError"),
        variant: "destructive",
      })
    }

    setloading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
      setFilesToUpload([...filesToUpload, ...Array.from(e.target.files)])
    }
  }
  const handleFileRemove = (file: any) => {
    setFiles(files.filter((f) => f.id !== file.id))
    setFilesToDelete([...filesToDelete, file])
  }

  const openFilePicker = () => {
    refFiles.current?.click()
  }

  // FIXME: Can't upload right now
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setloading(true)

    await updatePost(post, classroom, teacher, values)

    if (filesToUpload.length > 0) {
      const uploaded = await uploadFilesClassroom(files, classroom, post)
      const createdFiles = await Promise.all(
        filesToUpload.map((file) => createFile(file, post, classroom, teacher))
      )

      const postUpdatedFiles = await updatePostFiles(
        createdFiles,
        post,
        classroom
      )

      if (uploaded && createdFiles && postUpdatedFiles) {
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
        toast({
          title: t("toastTitleDeleteFilesError"),
          variant: "destructive",
        })
      } else {
        toast({
          title: t("toastTitleUploadFiles"),
        })
      }
    }

    router.refresh()
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
                          disabled={loading}
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
                            <div className="text-sm font-bold">{file.name}</div>
                            <div className="text-sm text-gray-500">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFileRemove(file)}
                            className="absolute right-0 top-0 pr-2"
                            disabled={loading}
                          >
                            <Icons.close className="mt-1.5 h-4 w-4 rounded-full border border-red-300 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
