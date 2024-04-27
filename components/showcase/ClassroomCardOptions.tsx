"use client"

import { useState } from "react"
import { Classroom, User } from "@prisma/client"
import { useTranslations } from "next-intl"

import { useRouter } from "@/lib/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"
import { toast } from "@/hooks/use-toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog"
import { Button } from "@/components/ui/Button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"
import { EditClassroom } from "@/components/form/EditClassroom"
import { Icons } from "@/components/icons/Lucide"

interface ClassroomCardProps {
  classroom: Classroom & {
    teacher: { user: User; id: string; userId: string }
  }
}

export function ClassroomCardOptions({ classroom }: ClassroomCardProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [isModifyOpen, setIsModifyOpen] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")
  const t = useTranslations("Components.Display.ClassroomCardOptions")

  const handleArchive = async () => {
    try {
      const res = await fetch(`/api/classrooms/${classroom.id}/archive`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: classroom.teacher.user.id,
          isArchived: true,
        }),
      })
      if (res.ok) {
        toast({
          title: t("toastTitleArchiveClassroom"),
          description: t("toastDescriptionArchiveClassroom"),
        })
        router.refresh()
      } else {
        toast({
          title: t("error-toast-archive"),
          description: t("error-description-toast-archive"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("error-toast-archive"),
        description: t("error-description-toast-archive"),
        variant: "destructive",
      })
    }
  }
  const handleUnarchive = async () => {
    try {
      const res = await fetch(`/api/classrooms/${classroom.id}/desarchive`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: classroom.teacher.user.id,
          isArchived: false,
        }),
      })
      if (res.ok) {
        toast({
          title: t("toastTitleunarchiveClassroom"),
          description: t("toastDescriptionunarchiveClassroom"),
        })
        router.refresh()
      } else {
        toast({
          title: t("error-toast-unarchive"),
          description: t("error-description-toast-unarchive"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("error-toast-unarchive"),
        description: t("error-description-toast-unarchive"),
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/classrooms/${classroom.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: classroom.teacher.user.id,
        }),
      })
      if (res.ok) {
        toast({
          title: t("toastTitleDeleteClassroom"),
          variant: "default",
          description: t("toastDescriptionDeleteClassroom"),
        })
        router.refresh()
      } else {
        toast({
          title: t("error-toast-delete"),
          description: t("error-description-toast-delete"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("error-toast-delete"),
        description: t("error-description-toast-delete"),
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="size-8 max-sm:size-6"
          >
            <Icons.moreHorizontal className="size-4" />
            <span className="sr-only">Toggle options of classroom</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("classroomOption")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => setIsModifyOpen(true)}
          >
            <Icons.editClassroom className="size-4 " />
            {t("editClassroom")}{" "}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => setIsArchiveOpen(true)}
          >
            <Icons.archiveClassroom className="h-4 w-4" />
            {classroom.isArchived
              ? t("unarchiveClassroom")
              : t("archiveClassroom")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 text-red-600 hover:cursor-pointer"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Icons.deleteClassroom className="size-4 " />
            {t("deleteClassroom")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isArchiveOpen && isDesktop ? (
        <AlertDialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {classroom.isArchived
                  ? t("alertDialogTitleUnarchive")
                  : t("alertDialogTitleArchive")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {classroom.isArchived
                  ? t("alertDialogDescriptionUnarchive")
                  : t("alertDialogDescriptionArchive")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("alertDialogCancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={classroom.isArchived ? handleUnarchive : handleArchive}
              >
                {t("alertDialogAction")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Drawer open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
          <DrawerContent className="pb-2">
            <DrawerHeader className="text-left">
              <DrawerTitle>
                {" "}
                {classroom.isArchived
                  ? t("alertDialogTitleUnarchive")
                  : t("alertDialogTitleArchive")}
              </DrawerTitle>
              <DrawerDescription>
                {classroom.isArchived
                  ? t("alertDialogDescriptionUnarchive")
                  : t("alertDialogDescriptionArchive")}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button
                  variant="default"
                  onClick={
                    classroom.isArchived ? handleUnarchive : handleArchive
                  }
                >
                  {t("alertDialogAction")}
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline">{t("alertDialogCancel")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      {isDeleteOpen && isDesktop ? (
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("alertDialogTitleDelete")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("alertDialogDescriptionDelete")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("alertDialogCancel")}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-700 hover:bg-red-500"
                onClick={handleDelete}
              >
                {t("alertDialogAction")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Drawer open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DrawerContent className="pb-2">
            <DrawerHeader className="text-left">
              <DrawerTitle>{t("alertDialogTitleDelete")}</DrawerTitle>
              <DrawerDescription>
                {t("alertDialogDescriptionDelete")}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="bg-red-700 text-white hover:bg-red-500"
                  onClick={handleDelete}
                >
                  {t("alertDialogAction")}
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline">{t("alertDialogCancel")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      {isModifyOpen && (
        <EditClassroom
          classroom={classroom}
          open={isModifyOpen}
          setOpen={setIsModifyOpen}
        />
      )}
    </>
  )
}
