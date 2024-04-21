"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { addClassroomSchema, commentAddCardSchema } from "@/config/schema"
import { useRouter } from "@/lib/navigation"
import { toast } from "@/hooks/use-toast"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"

import { Icons } from "../icons/Lucide"
import { Button } from "../ui/Button"
import { Card, CardContent } from "../ui/Card"
import { Textarea } from "../ui/Textarea"

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const res = await fetch(`/api/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: values.text,
          userId,
          parentId: parentid,
        }),
      })
      if (res.ok) {
        form.reset()
        toast({
          title: "Comment added",
          description: "Your comment has been added successfully",
          variant: "default",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: "An error occured while adding the comment",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      form.reset()
      setLoading(false)
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
