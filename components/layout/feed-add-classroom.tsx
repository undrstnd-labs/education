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
import { useMediaQuery } from "@/hooks/use-media-query"
import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
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
  const t = useTranslations("Pages.Classroom")
  const [isLoading, setIsLoading] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

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
        variant: "default",
        description: t("toastDescriptionAddClassroom"),
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

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">{t("buttonCreate")}</Button>
        </DialogTrigger>
        <DialogContent onCloseAutoFocus={() => form.reset()}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-8 text-center text-2xl font-bold text-primary">
                {t("buttonCreate")}
              </div>
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
                        placeholder={t("formClassroomDescriptionPlaceholder")}
                        {...field}
                        rows={2}
                        className="resize-none"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t("formClassroomButton")}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  } else {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button className="w-full">{t("buttonCreate")}</Button>
        </DrawerTrigger>
        <DrawerContent onCloseAutoFocus={() => form.reset()}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-6 pb-6"
            >
              <div className="mb-8 text-center text-2xl font-bold text-primary">
                {t("buttonCreate")}
              </div>
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
                        placeholder={t("formClassroomDescriptionPlaceholder")}
                        {...field}
                        rows={2}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                {t("formClassroomButton")}
              </Button>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    )
  }
}
