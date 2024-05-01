"use client"

import React from "react"
import Image from "next/image"
import { Conversation, File, Student, User } from "@prisma/client"
import { motion } from "framer-motion"
import { Document, Page, pdfjs } from "react-pdf"
import { useResizeDetector } from "react-resize-detector"

import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"

import { Icons } from "../icons/Lucide"

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

export function PDFRender({
  file,
  student,
  chat,
}: {
  file: File
  student: Student & { user: User }
  chat: Conversation
}) {
  const { toast } = useToast()
  const { width, ref } = useResizeDetector()
  const [pageNumber, setPageNumber] = React.useState<number>(1)

  return (
    <div className="mt-20 flex w-full flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-10 w-full items-center justify-between space-x-3 border-b border-gray-200 px-4 pb-3 dark:border-gray-700">
        <div className="flex-shrink-0">
          <Image
            className="h-10 w-10 rounded-full"
            src={student.user.image!}
            alt={student.user.name!}
            width={40}
            height={40}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
            {student.user.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(chat.createdAt)}
          </p>
        </div>
        <div className="flex flex-shrink-0 space-x-1 self-center">
          <Button
            aria-label="previous page"
            size={"small-icon"}
            className="hover:dark:bg-gray-600"
            variant={"ghost"}
          >
            <Icons.down className="h-4 w-4" />
          </Button>
          <Button
            aria-label="next page"
            size={"small-icon"}
            variant={"ghost"}
            className="hover:dark:bg-gray-600"
          >
            <Icons.up className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input className="h-8 w-12 dark:border-gray-600" />
            <span className="space-x-1 text-sm text-gray-500">/</span>
            <span className="text-sm text-gray-500">{pageNumber}</span>
          </div>
        </div>
      </div>

      <div className="max-h-screen w-full flex-1">
        <div ref={ref} className="z-0">
          <Document
            file={file.url}
            className="pointer-events-none max-w-full"
            loading={<PDFLoader />}
            onLoadSuccess={({ numPages }) => setPageNumber(numPages)}
            onLoadError={(error) => {
              toast({
                // TODO: Add translations
                title: "Error loading PDF",
                variant: "destructive",
              })
            }}
          >
            <Page width={width ? width : 1} pageNumber={1} />
          </Document>
        </div>
      </div>
    </div>
  )
}
