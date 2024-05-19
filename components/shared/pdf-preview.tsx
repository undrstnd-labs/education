"use client"

import React from "react"
import { motion } from "framer-motion"
import { Document, Page, pdfjs } from "react-pdf"

import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"

import { File } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useResizeDetector } from "react-resize-detector"

import { useToast } from "@/hooks/use-toast"

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

export function PDFPreview({ file }: { file: File }) {
  const { toast } = useToast()
  const { width, ref } = useResizeDetector()

  const t = useTranslations("app.components.app.account-shared-pdf-preview")

  return (
    <div ref={ref} className="z-0">
      <Document
        file={file.url}
        loading={<PDFLoader />}
        onLoadError={(error) => {
          toast({
            title: t("error"),
            variant: "destructive",
          })
        }}
      >
        <Page
          key={file.id}
          width={width ? width : 1}
          pageNumber={1}
          loading={<PDFLoader />}
        />
      </Document>
    </div>
  )
}
