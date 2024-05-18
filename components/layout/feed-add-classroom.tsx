"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Teacher } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { addClassroomSchema } from "@/config/schema"
import { useRouter } from "@/lib/navigation"
import { generateHash } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { ResponsiveDialog } from "@/components/shared/responsive-dialog"
import { Button } from "@/components/ui/button"
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

import { createClassroom } from "@/undrstnd/classroom"

export function AddClassroom({ teacher }: { teacher: Teacher }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations("app.components.layout.feed-add-classroom")

  const formSchema = addClassroomSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const classCode = generateHash()

    const classroom = await createClassroom(
      classCode,
      teacher,
      values.name,
      values.description
    )

    if (classroom) {
      toast({
        title: t("toastTitleAddClassroom"),
      })
      router.refresh()
      form.reset()
    } else {
      toast({
        title: t("toast-title-create-error"),
        variant: "destructive",
      })
    }

    setIsLoading(false)
    setOpen(false)
  }

  return (
    <ResponsiveDialog
      title={t("buttonCreate")}
      description={t("dialog-description-create")}
      loading={isLoading}
      open={open}
      setOpen={setOpen}
      action={() => setOpen(false)}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    placeholder={t("formClassroomDescriptionPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.loader className="mr-2 h-5 w-5 animate-spin" />
            )}
            {t("formClassroomButton")}
          </Button>
        </form>
      </Form>
    </ResponsiveDialog>
  )
}
