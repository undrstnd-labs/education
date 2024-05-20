"use client"

import { KeyboardEvent, useRef, useState } from "react"
import { createComment } from "@/actions/comment"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { commentAddCardSchema } from "@/config/schema"
import { useRouter } from "@/lib/navigation"
import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

interface CommentAddCardProps {
  postId: string
  userId: string
  parentid?: string
}

const CommentAddCard = ({ postId, userId, parentid }: CommentAddCardProps) => {
  const [loading, setLoading] = useState(false)
  const t = useTranslations("Pages.Classroom")
  const formSchema = commentAddCardSchema(t)
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    const comment = await createComment(userId, postId, values.text, parentid)
    if (comment) {
      toast({
        title: t("commendAddedTitleToast"),
        description: t("commendAddedDescriptionToast"),
        variant: "default",
      })
      form.reset()
      router.refresh()
    } else {
      toast({
        title: t("commentAddedTitleToastErreur"),
        description: t("commentAddedDescriptionToastErreur"),
        variant: "destructive",
      })
    }

    setLoading(false)
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      form.handleSubmit(onSubmit)()
    }
  }
  return (
    <Card>
      <CardContent className="w-full  px-6 py-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder={t("addCommentPlaceholder")}
                        {...field}
                        disabled={loading}
                        ref={textareaRef}
                        onKeyDown={handleKeyDown}
                      />

                      <Button
                        type="submit"
                        size={"icon"}
                        variant={"outline"}
                        className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full border border-gray-500
                       hover:bg-accent max-sm:size-5"
                        disabled={loading}
                      >
                        <Icons.add className="size-5 text-gray-500 max-sm:size-4 " />
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CommentAddCard
