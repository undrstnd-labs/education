import React, { KeyboardEvent, useRef, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Post, Student, Teacher, User } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { commentAddCardSchema } from "@/config/schema"
import { useRouter } from "@/lib/navigation"
import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { createComment } from "@/undrstnd/comment"

export function FeedClassroomPostAddComment({
  entity,
  post,
  parentId,
}: {
  entity: (Student & { user: User }) | (Teacher & { user: User })
  post: Post
  parentId?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const t = useTranslations("Pages.Classroom")
  const formSchema = commentAddCardSchema(t)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  })

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      form.handleSubmit(onSubmit)()
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    const comment = await createComment(
      entity.user.id,
      post.id,
      values.text,
      parentId
    )

    if (comment) {
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

  return (
    <div className="flex items-start space-x-4 px-4 py-2">
      <div className="hidden flex-shrink-0 sm:block">
        <Image
          className="inline-block h-10 w-10 rounded-full"
          src={entity.user.image!}
          alt={entity.user.name!}
          width={100}
          height={100}
        />
      </div>
      <div className="min-w-0 flex-1">
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
                        rows={3}
                        className="block w-full resize-none"
                      />
                      <Button
                        type="submit"
                        variant="default"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <Icons.loader
                            className="h-6 w-6 animate-spin text-secondary"
                            aria-hidden="true"
                          />
                        ) : (
                          <Icons.enter
                            className="h-6 w-6 text-secondary"
                            aria-hidden="true"
                          />
                        )}

                        <span className="sr-only">Comment</span>
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}
