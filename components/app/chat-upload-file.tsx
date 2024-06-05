import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@navigation"
import { useTranslations } from "next-intl"
import { DropzoneOptions } from "react-dropzone"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { uploadFileSchema } from "@/config/schema"
import { uploadFilesStudent } from "@/lib/storage"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useToast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload"
import { Form, FormField, FormItem } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"

import { saveChat } from "@/undrstnd/chat"
import { vectorizedDocument } from "@/undrstnd/pinecone"

type uploadFileType = z.infer<ReturnType<typeof uploadFileSchema>>

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
        {t("pdf-only")}
      </p>
    </>
  )
}

export function ChatUploadFile({
  open,
  setOpen,
  id,
  studentId,
}: {
  open: boolean
  setOpen: (value: boolean) => void
  id: string
  studentId: string
}) {
  const router = useRouter()
  const { toast } = useToast()

  const t = useTranslations("Components.Form.Prompt")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [progress, setProgress] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(false)

  const form = useForm<uploadFileType>({
    resolver: zodResolver(uploadFileSchema(t)),
  })

  const dropzone = {
    multiple: false,
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
    },
  } satisfies DropzoneOptions

  const simulateUpload = () => {
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) {
          clearInterval(interval)
          return prev
        }
        return prev + 2
      })
    }, 500)

    return interval
  }

  async function onSubmit(data: uploadFileType) {
    setLoading(true)
    const progress = simulateUpload()
    const file = data.files[0]

    try {
      const uploadedFile = await uploadFilesStudent(file, studentId, id)
      await Promise.all([
        vectorizedDocument(id, uploadedFile),
        saveChat(id, studentId, uploadedFile, `/chat/c/${id}`),
      ])

      router.push(`/chat/c/${id}`)
      router.refresh()

      setProgress(100)
      toast({
        title: t("upload-success"),
      })
      await new Promise((resolve) => setTimeout(resolve, 500))

      setOpen(false)
      form.reset({ files: [] })
    } catch (error) {
      console.error(error)
      toast({
        title: t("upload-failed"),
        variant: "destructive",
      })

      clearInterval(progress)
      setProgress(0)
    } finally {
      clearInterval(progress)
      setProgress(0)
      setLoading(false)
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("upload-file")}</DialogTitle>
            <DialogDescription>
              {t("upload-file-description")}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div
                className={`flex w-full flex-col items-center justify-center gap-x-2 rounded-md px-2 pb-1 outline outline-1 outline-border ${
                  form.watch("files") ? "pt-4" : "pt-2"
                }`}
              >
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        dropzoneOptions={dropzone}
                        reSelect={true}
                        className="relative rounded-lg bg-background p-2"
                      >
                        <div className="flex w-full flex-col items-center justify-center">
                          <FileInput className="w-full outline-dashed outline-1 outline-white">
                            <div className="flex flex-col items-center justify-center pb-4 pt-3">
                              <FileSvgDraw t={t} />
                            </div>
                          </FileInput>

                          {field.value && field.value.length > 0 && (
                            <FileUploaderContent className="w-full text-center">
                              {field.value.map((file, i) => (
                                <FileUploaderItem
                                  uploading={loading}
                                  key={i}
                                  index={i}
                                >
                                  <Icons.paperclip className="h-4 w-4 stroke-current" />
                                  <span className="pr-8">{file.name}</span>
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
              </div>
              {form.formState.errors && (
                <div className="text-sm text-destructive">
                  {Object.values(form.formState.errors).map((error) => (
                    <p key={error.message}>{error.message}</p>
                  ))}
                </div>
              )}
              <div className="h-3" />
              <Button
                type="submit"
                className="h-8 w-full py-2"
                disabled={loading}
              >
                {loading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t("upload")}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("upload-file")}</DrawerTitle>
          <DrawerDescription>{t("upload-file-description")}</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div
              className={`flex w-full flex-col items-center justify-center gap-x-2 rounded-md px-2 pb-1 outline outline-1 outline-border ${
                form.watch("files") !== null ? "pt-4" : "pt-2"
              }`}
            >
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      dropzoneOptions={dropzone}
                      reSelect={true}
                    >
                      <FileInput className="w-full outline-dashed outline-1 outline-white">
                        <div className="flex flex-col items-center justify-center pb-4 pt-3">
                          <FileSvgDraw t={t} />
                        </div>
                      </FileInput>

                      {field.value && field.value.length > 0 && (
                        <FileUploaderContent>
                          {field.value.map((file, i) => (
                            <FileUploaderItem
                              uploading={!loading}
                              key={i}
                              index={i}
                            >
                              <Icons.paperclip className="h-4 w-4 stroke-current" />
                              <span className="pr-8">{file.name}</span>
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
                    </FileUploader>
                  </FormItem>
                )}
              />
            </div>
            {form.formState.errors && (
              <div className="text-sm text-destructive">
                {Object.values(form.formState.errors).map((error) => (
                  <p key={error.message}>{error.message}</p>
                ))}
              </div>
            )}
            <div className="h-3" />
            <Button
              type="submit"
              className="h-8 w-full py-2"
              disabled={loading}
            >
              {loading && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              {t("upload")}
            </Button>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
