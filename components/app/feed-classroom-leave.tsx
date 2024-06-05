"use client"

import { useState } from "react"
import { useRouter } from "@navigation"
import { Classroom, Student } from "@prisma/client"
import { useTranslations } from "next-intl"

import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { ResponsiveAlertDialog } from "@/components/shared/responsive-alert-dialog"
import { Button } from "@/components/ui/button"

import { leaveClassroom } from "@/undrstnd/classroom"

interface LeaveClassroomProps {
  classroom: Classroom
  student: Student
}

export function FeedClassroomLeave({
  classroom,
  student,
}: LeaveClassroomProps) {
  const router = useRouter()
  const t = useTranslations(
    "app.components.app.feed-classroom-dropdown-actions"
  )

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLeave = async () => {
    setLoading(true)
    const classroomLeft = await leaveClassroom(student, classroom)

    if (classroomLeft) {
      toast({
        title: t("leaveApiSuccess"),
        description: t("leaveApiSuccessDescription"),
      })
    }
    router.refresh()
    router.push("/classroom")
    setLoading(false)
    setOpen(false)
  }
  return (
    <div>
      <Button
        variant="outline"
        size={"icon"}
        className="size-8 max-sm:size-6"
        onClick={() => setOpen(true)}
      >
        <Icons.leaveClassroom className="size-4 text-red-500" />
        <span className="sr-only">Leave classroom</span>
      </Button>
      <ResponsiveAlertDialog
        title={t("alertDialogLeave")}
        description={t("alertDialogLeaveDescription")}
        cancelText={t("alertDialogCancel")}
        confirmText={t("alertDialogAction")}
        loading={loading}
        open={open}
        setOpen={setOpen}
        action={handleLeave}
      />
    </div>
  )
}
