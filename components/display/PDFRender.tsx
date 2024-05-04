"use client"

import React from "react"
import Image from "next/image"
import { Conversation, File, Student, User } from "@prisma/client"
import { motion } from "framer-motion"
import { Document, Page, pdfjs } from "react-pdf"
import { useResizeDetector } from "react-resize-detector"
import SimpleBar from "simplebar-react"

import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { PDFFullScreen } from "@/components/display/PDFFullScreen"
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

// TODO: Add translations
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

  const [scale, setScale] = React.useState<number>(1)
  const [rotation, setRotation] = React.useState<number>(0)
  const [currPage, setCurrpage] = React.useState<number>(1)
  const [pageNumber, setPageNumber] = React.useState<number>(1)

  return (
    <div className="mt-20 flex w-full flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-black/80">
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
            disabled={currPage === 1}
            onClick={() => {
              setCurrpage((prev) => (prev > 1 ? prev - 1 : prev))
            }}
          >
            <Icons.down className="h-4 w-4" />
          </Button>
          <Button
            aria-label="next page"
            size={"small-icon"}
            variant={"ghost"}
            disabled={currPage === pageNumber}
            onClick={() => {
              setCurrpage((prev) => (prev < pageNumber ? prev + 1 : prev))
            }}
            className="hover:dark:bg-gray-600"
          >
            <Icons.up className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              className="h-8 w-12 focus-visible:ring-sky-500 dark:border-gray-600"
              value={currPage}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                if (value > 0 && value <= pageNumber) {
                  setCurrpage(value)
                }
              }}
            />
            <span className="space-x-1 text-sm text-gray-500">/</span>
            <span className="text-sm text-gray-500">{pageNumber}</span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size={"small-icon"}
                variant={"ghost"}
                className="hover:dark:bg-gray-600"
              >
                <Icons.settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">View options</h4>
                  <p className="text-sm text-muted-foreground">
                    Customize the view of the PDF
                  </p>
                </div>
                <div className="l grid gap-2">
                  <div className="-ml-1 grid w-full grid-cols-2 items-center gap-3 space-x-3">
                    <Label htmlFor="rotation">New window</Label>
                    <PDFFullScreen file={file} />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="zoom">Zoom</Label>

                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          className="gap-1.5"
                          aria-label="zoom"
                          variant={"outline"}
                        >
                          <Icons.search className="h-4 w-4" />
                          {scale * 100}%{" "}
                          <Icons.down className="h-3 w-3 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setScale(1.75)
                          }}
                        >
                          175%
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setScale(1.5)
                          }}
                        >
                          150%
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setScale(1.25)
                          }}
                        >
                          125%
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setScale(1)
                          }}
                        >
                          100%
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setScale(0.75)
                          }}
                        >
                          75%
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setScale(0.5)
                          }}
                        >
                          50%
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setScale(0.25)
                          }}
                        >
                          25%
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-3 space-x-2">
                    <Label htmlFor="rotation">Rotation</Label>
                    <div className="space-x-2">
                      <Button
                        aria-label="rotate 90 degrees"
                        variant={"outline"}
                        onClick={() => setRotation((prev) => prev + 90)}
                      >
                        <Icons.rotateCw className="h-4 w-4" />
                      </Button>
                      <Button
                        aria-label="rotate 90 degrees"
                        variant={"outline"}
                        onClick={() => setRotation((prev) => prev - 90)}
                      >
                        <Icons.rotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="max-h-screen w-full flex-1">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-20rem)]">
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
                pageNumber={currPage}
                scale={scale}
                rotate={rotation}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  )
}
