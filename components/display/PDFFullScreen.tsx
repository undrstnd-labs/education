import React from "react"
import { File } from "@prisma/client"
import { motion } from "framer-motion"
import { Document, Page, pdfjs } from "react-pdf"
import { useResizeDetector } from "react-resize-detector"
import SimpleBar from "simplebar-react"

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/Dialog"
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

  const [scale, setScale] = React.useState<number>(1)
  const [rotation, setRotation] = React.useState<number>(0)
  const [pageNumber, setPageNumber] = React.useState<number>(1)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label="open in dialog"
          variant={"outline"}
          className="w-full"
        >
          <Icons.external className="h-4 w-4" />
          <span className="whitespace-nowrap px-1">Open</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-7xl">
        <DialogHeader>
          <SimpleBar
            autoHide={false}
            className="mt-6 max-h-[calc(100vh-10rem)]"
          >
            <div ref={ref} className="z-0">
              <Document
                file={file.url}
                className="pointer-events-none max-w-full"
                loading={<PDFLoader />}
                onLoadSuccess={({ numPages }) => setPageNumber(numPages)}
                onLoadError={(error) => {
                  toast({
                    title: "Error loading PDF",
                    variant: "destructive",
                  })
                }}
              >
                <Page
                  width={width ? width : 1}
                  scale={scale}
                  rotate={rotation}
                />
              </Document>
            </div>
          </SimpleBar>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
