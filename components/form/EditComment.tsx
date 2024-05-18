"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { comment } from "@/types/classroom"

import { editCommentSchema } from "@/config/schema"
import { useRouter } from "@/lib/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"
import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Dialog, DialogContent } from "../ui/dialog"
import { Drawer, DrawerContent } from "../ui/drawer"
import { Textarea } from "../ui/textarea"

interface EditCommentProps {
  postId: string
  userId: string
  comment: comment
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const EditComment = ({
  postId,
  userId,
  comment,
  open,
  setOpen,
}: EditCommentProps) => {
  const [loading, setLoading] = useState(false)
  const t = useTranslations("Pages.Classroom")
  const formSchema = editCommentSchema(t)
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: comment.text || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const res = await fetch(`/api/comments/${postId}/${comment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: values.text,
          userId,
          parentId: comment.parentId,
        }),
      })
      if (res.ok) {
        form.reset()
        toast({
          title: t("upadtedCommentToastTitle"),
          description: t("upadtedCommentToastDescription"),
          variant: "default",
        })
        router.refresh()
      } else {
        toast({
          title: t("upadtedCommentToastTitleError"),
          description: t("upadtedCommentToastDescriptionError"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("upadtedCommentToastTitleError"),
        description: t("upadtedCommentToastDescriptionError"),
        variant: "destructive",
      })
    } finally {
      form.reset()
      setLoading(false)
      setOpen(false)
    }
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="mb-8 text-center text-2xl font-bold text-primary">
                {t("updatedCommentTitle")}
              </div>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {t("updatedCommentTitleLabel")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("addCommentPlaceholder")}
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
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
        <DrawerContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-6 pb-6"
            >
              <div className="mb-8 text-center text-2xl font-bold text-primary">
                {t("updatedCommentTitleLabel")}
              </div>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">
                      {" "}
                      {t("updatedCommentTitleLabel")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("addCommentPlaceholder")}
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
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

export default EditComment
