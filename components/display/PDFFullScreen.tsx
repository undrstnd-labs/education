import React from "react"
import { File } from "@prisma/client"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Document, Page, pdfjs } from "react-pdf"
import { useResizeDetector } from "react-resize-detector"
import SimpleBar from "simplebar-react"

import { downloadFileFromUrl } from "@/lib/storage"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/Dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { Icons } from "@/components/icons/Lucide"

import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function PDFLoader() {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0 50%", "100% 50%", "0 50%"],
    },
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
      }}
      className="flex h-full min-h-screen w-full flex-1 animate-pulse rounded-lg bg-gray-300 p-8 dark:bg-gray-800"
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  )
}

export function PDFFullScreen({ file }: { file: File }) {
  const { toast } = useToast()
  const { width, ref } = useResizeDetector()

  const [pageNumber, setPageNumber] = React.useState<number>(1)
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const t = useTranslations("Components.Display.PDFFullScreen")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label="open in dialog"
          variant={"outline"}
          className="w-full"
        >
          <Icons.external className="h-4 w-4" />
          <span className="whitespace-nowrap px-1">{t("open")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-7xl">
        <DialogHeader>
          <div className="flex items-center justify-between px-4">
            <h2 className="text-lg font-semibold">{file.name}</h2>
            <div className="ml-auto flex flex-shrink-0 space-x-1 self-center px-6">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    className="hover:dark:bg-gray-600"
                    onClick={() => {
                      downloadFileFromUrl(
                        file.url.split(
                          `${process.env.NEXT_PUBLIC_SUPABASE_URL}storage/v1/object/public/files/`
                        )[1]
                      )
                    }}
                  >
                    <Icons.download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{t("download")}</span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size={"icon"}
                    className="hover:dark:bg-gray-600"
                    variant={"outline"}
                    onClick={() => {
                      copyToClipboard(file.url)
                    }}
                  >
                    {isCopied ? (
                      <Icons.check className="h-4 w-4" />
                    ) : (
                      <Icons.share className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{t("copy")}</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </DialogHeader>

        <SimpleBar autoHide={false} className="mt-6 max-h-[calc(100vh-10rem)]">
          <div ref={ref} className="z-0">
            <Document
              file={file.url}
              className="pointer-events-none max-w-full"
              loading={<PDFLoader />}
              onLoadSuccess={({ numPages }) => setPageNumber(numPages)}
              onLoadError={(error) => {
                toast({
                  title: t("error"),
                  variant: "destructive",
                })
              }}
            >
              {new Array(pageNumber).fill(0).map((_, index) => (
                <Page
                  key={index}
                  pageNumber={index + 1}
                  width={width ? width : 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  )
}
