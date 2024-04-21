"use client"

import { useState } from "react"
import { Classroom } from "@prisma/client"

import { Icons } from "../icons/Lucide"
import { Button } from "../ui/Button"

interface ShareClassroomProps {
  classroom: Classroom
}

const ShareClassroom = ({ classroom }: ShareClassroomProps) => {
  const [copied, setCopied] = useState(false)
  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `${window.location.origin}/dashboard/classroom/join/${classroom.classCode}`
      )

      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  return (
    <Button
      variant="outline"
      size={"icon"}
      className="h-8 w-8 max-sm:h-6 max-sm:w-6"
      onClick={copyLink}
    >
      {copied ? (
        <Icons.shareClassroomTaked className="h-4 w-4" />
      ) : (
        <Icons.shareClassroom className="h-4 w-4" />
      )}
      <span className="sr-only">Share classroom</span>
    </Button>
  )
}

export default ShareClassroom
