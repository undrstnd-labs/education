"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter } from "@navigation"
import { Classroom, User } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { editClassroomSchema } from "@/config/schema"
import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { ResponsiveAlertDialog } from "@/components/shared/responsive-alert-dialog"
import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  deleteClassroom,
  editClasroom,
  handleArchiveClassroom,
} from "@/undrstnd/classroom"

interface ClassroomCardProps {
  classroom: Classroom & {
    teacher: { user: User; id: string; userId: string }
  }
}

export function FeedClassroomDropdownActions({
  classroom,
}: ClassroomCardProps) {
  const router = useRouter()
  const path = usePathname()
  const t = useTranslations(
    "app.components.app.feed-classroom-dropdown-actions"
  )

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isModifyOpen, setIsModifyOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)

  const formSchema = editClassroomSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: classroom.name || "",
      description: classroom.description || "",
    },
  })

  async function handleDelete() {
    setIsLoading(true)

    const classroomResult = await deleteClassroom(classroom.teacher, classroom)

    if (classroomResult) {
      toast({
        title: t("toastTitleDeleteClassroom"),
        description: t("toastDescriptionDeleteClassroom"),
      })
      router.refresh()
    } else {
      toast({
        title: t("error-toast-delete"),
        variant: "destructive",
      })
    }

    if (path === `/classroom/${classroom.id}`) {
      router.push("/classroom")
    }

    setIsLoading(false)
    setIsDeleteOpen(false)
  }

  async function handleArchive(isArchived: boolean) {
    setIsLoading(true)

    const classroomResult = await handleArchiveClassroom(isArchived, classroom)

    if (classroomResult.isArchived === isArchived) {
      toast({
        title: t("toastTitleArchiveClassroom"),
        description: t("toastDescriptionArchiveClassroom"),
      })
      router.refresh()
    } else {
      toast({
        title: t("error-toast-archive"),
        variant: "destructive",
      })
    }

    setIsLoading(false)
    setIsArchiveOpen(false)
  }

  async function handleEdit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const updatedClassroom = await editClasroom(
      classroom.teacher,
      classroom,
      values
    )

    if (updatedClassroom) {
      toast({
        title: t("toastTitleUpdateClassroom"),
      })

      router.refresh()
    } else {
      toast({
        title: t("toastTitleUpdateClassroomError"),
        variant: "destructive",
      })
    }

    setIsLoading(false)
    setIsModifyOpen(false)
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

      <ResponsiveAlertDialog
        title={t("alertDialogTitleDelete")}
        description={t("alertDialogDescriptionDelete")}
        cancelText={t("alertDialogCancel")}
        confirmText={t("alertDialogAction")}
        loading={loading}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        action={handleDelete}
      />

      <ResponsiveAlertDialog
        title={
          classroom.isArchived
            ? t("alertDialogTitleUnarchive")
            : t("alertDialogTitleArchive")
        }
        description={
          classroom.isArchived
            ? t("alertDialogDescriptionUnarchive")
            : t("alertDialogDescriptionArchive")
        }
        cancelText={t("alertDialogCancel")}
        confirmText={t("alertDialogAction")}
        loading={loading}
        open={isArchiveOpen}
        setOpen={setIsArchiveOpen}
        action={() => {
          if (classroom.isArchived) {
            handleArchive(false)
          } else {
            handleArchive(true)
          }
        }}
      />

      {isModifyOpen && (
        <ResponsiveDialog
          title={t("dialog-title-edit")}
          description={t("dialog-description-edit")}
          loading={loading}
          open={isModifyOpen}
          setOpen={setIsModifyOpen}
          action={() => ({})}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleEdit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelClassroomName")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("formClassroomNamePlaceholder")}
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("formLabelClassroomDescription")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        disabled={loading}
                        placeholder={t("formClassroomDescriptionPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && (
                  <Icons.loader className="mr-2 h-5 w-5 animate-spin" />
                )}
                {t("dialog-confirm-edit")}
              </Button>
            </form>
          </Form>
        </ResponsiveDialog>
      )}
    </>
  )
}
