import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter } from "@navigation"
import { UseChatHelpers } from "ai/react"
import { useTranslations } from "next-intl"
import { DropzoneOptions } from "react-dropzone"
import { useForm } from "react-hook-form"
import z from "zod"

import { uploadFileSchema } from "@/config/schema"
import { cn } from "@/lib/utils"
import { useEnterSubmit } from "@/hooks/use-enter-submit"
import { useMediaQuery } from "@/hooks/use-media-query"

import { Button, buttonVariants } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer"
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/FileUpload"
import { Form, FormField, FormItem } from "@/components/ui/Form"
import { Progress } from "@/components/ui/Progress"
import { Textarea } from "@/components/ui/Textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { Icons } from "@/components/icons/Lucide"

type uploadFileType = z.infer<ReturnType<typeof uploadFileSchema>>

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => void
  isLoading: boolean
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
        {t("pdf-only")}
      </p>
    </>
  )
}

function ActionButton({ onClick, icon, label }: any) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              buttonVariants({ size: "icon", variant: "outline" }),
              "absolute left-0 top-3 size-4 rounded-full bg-background p-0 sm:left-4"
            )}
          >
            {icon}
            <span className="sr-only">{label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function UploadModel({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (value: boolean) => void
}) {
  const t = useTranslations("Components.Form.Prompt")
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [loading, setLoading] = React.useState<boolean>(false)
  const [progress, setProgress] = React.useState<number>(0)

  const form = useForm<uploadFileType>({
    resolver: zodResolver(uploadFileSchema(t)),
  })

  const dropzone = {
    multiple: false,
    maxFiles: 1,
    maxSize: 25 * 1024 * 1024,
  } satisfies DropzoneOptions

  const simulateUpload = () => {
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 7
      })
    }, 500)

    return interval
  }

  async function onSubmit(data: uploadFileType) {
    setLoading(true)
    const progress = simulateUpload()

    await new Promise((resolve) => setTimeout(resolve, 3000))
    // TODO: Storing files in /students/{STUDENTID}/{CONVERSATIONID}/{FILEID}

    console.log(data)

    clearInterval(progress)
    setProgress(100)
    setLoading(false)
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

export function Prompt({ onSubmit, input, setInput, isLoading }: PromptProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const { formRef, onKeyDown } = useEnterSubmit()
  const t = useTranslations("Components.Form.Prompt")
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const isChatPath = pathname.includes("/chat/c/")

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput("")
        onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <ActionButton
          onClick={() => {
            if (isChatPath) {
              router.push("/chat/")
            }
            setOpen(true)
          }}
          icon={
            isChatPath ? (
              <Icons.add className="size-4 rounded-full" />
            ) : (
              <Icons.upload className="size-4 rounded-full" />
            )
          }
          label={isChatPath ? t("new-chat") : t("upload-file")}
        />

        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          maxRows={8}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("send-message") + "..."}
          spellCheck={false}
          className="min-h-[60px] w-full resize-none border-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-3 sm:right-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || input === ""}
                >
                  <Icons.enter />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("send-message")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <UploadModel open={open} setOpen={setOpen} />
    </form>
  )
}
