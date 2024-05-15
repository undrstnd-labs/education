"use client"

import { useState } from "react"
import { Classroom } from "@prisma/client"

import { Icons } from "../icons/Lucide"
import { Button } from "../ui/Button"

interface ShareClassroomProps {
  classroom: Classroom
}

export function ShareClassroom({ classroom }: ShareClassroomProps) {
  const [copied, setCopied] = useState(false)
  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}/classroom/join/${classroom.classCode}`
      )

      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  return (
    <Button
      variant="outline"
      size={"icon"}
      className="size-8 max-sm:size-6"
      onClick={copyLink}
    >
      {copied ? (
        <Icons.shareClassroomTaked className="size-4" />
      ) : (
        <Icons.shareClassroom className="size-4" />
      )}
      <span className="sr-only">Share classroom</span>
    </Button>
  )
}
