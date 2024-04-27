"use client"

import React, { Dispatch, SetStateAction, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { classroom, post } from "@/types/classroom"

import { editPostSchema } from "@/config/schema"
import { useRouter } from "@/lib/navigation"
import { deleteFiles, uploadFiles } from "@/lib/storage"
import { useMediaQuery } from "@/hooks/use-media-query"
import { toast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent } from "@/components/ui/Dialog"
import { Drawer, DrawerContent } from "@/components/ui/Drawer"
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

import { Icons } from "../icons/Lucide"

interface EditPostProps {
  post: post
  userId: string
  classroom: classroom
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const EditPost = ({
  classroom,
  open,
  post,
  setOpen,
  userId,
}: EditPostProps) => {
  const router = useRouter()
  const t = useTranslations("Pages.Classroom")
  const [files, setFiles] = useState<any[]>(post.files || [])
  const [isLoading, setIsLoading] = useState(false)
  const refFiles = useRef<HTMLInputElement>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const formSchema = editPostSchema(t)
  console.log(files)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: post.name || "",
      content: post.content || "",
      files: post.files || [],
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
      deleteFiles(post.files.map((file) => file.url)).catch(() => {
        toast({
          title: t("toastFilesFailed"),
          variant: "destructive",
          description: t("toastFilesFailedDescription"),
        })
        return
      })
      uploadFiles(files, classroom, post)
        .then(async (res) => {
          const resUpdate = await fetch(
            `/api/posts/${classroom.id}/${post.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: values.name,
                content: values.content,
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
              title: t("toastPostModifiedSuccess"),
              variant: "default",
              description: t("toastPostModifiedSuccessDescription"),
            })
          } else {
            toast({
              title: t("toastPostModifiedFailed"),
              variant: "destructive",
              description: t("toastPostModifiedFailedDescription"),
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
        title: t("toastPostModifiedFailed"),
        variant: "destructive",
        description: t("toastFilesFailedDescription"),
      })
    }
  }
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-8 text-center text-2xl font-bold text-primary">
                {t("updatePostTitle")}
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
                              <Icons.close className="mt-1.5 h-4 w-4 rounded-full border border-red-300 text-red-500" />
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
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
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
        <DrawerContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-6 pb-6"
            >
              <div className="mb-8 text-center text-2xl font-bold text-primary">
                {t("updatePostTitle")}
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
                              <Icons.close className="mt-1.5 h-4 w-4 rounded-full border border-red-300 text-red-500" />
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
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
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

export default EditPost
