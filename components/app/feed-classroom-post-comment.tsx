import React from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { Post, Student, Teacher, User } from "@prisma/client"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { set, z } from "zod"

import { Comment } from "@/types/classroom"

import { editCommentSchema } from "@/config/schema"
import { formatDate } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

import { FeedClassroomPostAddComment } from "@/components/app/feed-classroom-post-add-comment"
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

import { deleteComment, getComment, updateComment } from "@/undrstnd/comment"

interface FeedClassroomPostCommentProps {
  entity: (Student & { user: User }) | (Teacher & { user: User })
  comment: Comment
  post: Post
}

function DropdownActions({
  t,
  comment,
  post,
}: {
  t: (key: string) => string
  comment: Comment
  post: Post
}) {
  const [loading, setLoading] = React.useState(false)
  const [isModifyOpen, setIsModifyOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  const formSchema = editCommentSchema(t)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: comment.text || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    const commentUpdated = await updateComment(
      post.id,
      comment.id,
      values.text,
      comment.parentId
    )

    if (!commentUpdated) {
      form.reset()
      toast({
        title: t("toast-error-update"),
        variant: "destructive",
      })
    }

    setLoading(false)
    setIsModifyOpen(false)
  }

  const handleDelete = async () => {
    try {
      const commentDeleted = await deleteComment(post.id, comment.id)
      if (!commentDeleted) {
        toast({
          title: t("toast-error-delete"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: t("toast-error-delete"),
        variant: "destructive",
      })
    }
    setIsDeleteOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"small-icon"} variant="outline">
            <Icons.moreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("option-comment")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsModifyOpen(true)
            }}
            className="flex items-center gap-2 hover:cursor-pointer"
          >
            <Icons.editClassroom className="h-4 w-4 " />
            {t("edit-comment")}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 text-red-600 hover:cursor-pointer"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Icons.deleteClassroom className="h-4 w-4 " />
            {t("delete-comment")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveDialog
        title={t("dialog-title-edit")}
        description={t("dialog-description-edit")}
        loading={loading}
        open={isModifyOpen}
        setOpen={setIsModifyOpen}
        action={() => ({})}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    {t("updated-comment-title-label")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("add-comment-placeholder")}
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
              {t("form-comment-button")}
            </Button>
          </form>
        </Form>
      </ResponsiveDialog>

      <ResponsiveAlertDialog
        title={t("alert-dialog-title-delete")}
        description={t("alert-dialog-description-delete")}
        cancelText={t("alert-dialog-cancel")}
        confirmText={t("alert-dialog-action")}
        loading={loading}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        action={handleDelete}
      />
    </>
  )
}

function Reply({
  reply,
  post,
  t,
  entity,
}: {
  reply: Comment
  post: Post
  t: (key: string) => string
  entity: (Student & { user: User }) | (Teacher & { user: User })
}) {
  const [user, setUser] = React.useState(reply.user)
  const [isLoading, setIsLoading] = React.useState(true)
  const [date, setDate] = React.useState(reply.createdAt)

  React.useEffect(() => {
    async function fetchData() {
      if (!user) {
        setIsLoading(true)
        try {
          const data = (await getComment(reply.postId, reply.id))!
          setIsLoading(false)
          setUser(data.user as User)
          setDate(data.createdAt)
        } catch (error) {
          console.log(error)
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  return (
    <li key={post.id} className="py-4">
      <div className="flex items-center gap-x-3">
        {isLoading ? (
          <Skeleton className="h-6 w-6 rounded-full" />
        ) : (
          <Image
            src={user.image!}
            alt={user.name!}
            width={24}
            height={24}
            className="h-6 w-6 flex-none rounded-full"
          />
        )}
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <Skeleton className="h-4 w-[250px]" />
          ) : (
            <h3 className="flex-auto truncate text-sm font-semibold capitalize leading-6 text-secondary-foreground">
              {user.name}
            </h3>
          )}
          <span className="mx-1">•</span>
          {isLoading ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            <time
              dateTime={date.toString()}
              className="flex-none text-xs text-secondary-foreground/50"
            >
              {formatDate(new Date(date), t)}
            </time>
          )}
          {reply.createdAt !== reply.updatedAt && (
            <span className="flex-none text-xs text-secondary-foreground/50">
              ({t("edited")})
            </span>
          )}
        </div>
        {isLoading ? (
          <div className="ml-auto flex items-center space-x-2">
            <Skeleton className="size-6" />
          </div>
        ) : (
          <>
            {reply.userId === entity.user.id && (
              <div className="ml-auto flex items-center space-x-2">
                <DropdownActions t={t} comment={reply} post={post} />
              </div>
            )}
          </>
        )}
      </div>
      <p className="mt-3 truncate text-sm text-secondary-foreground/80">
        {reply.text}
      </p>
    </li>
  )
}

function ReplyComment({
  t,
  entity,
  post,
  comment,
  user,
}: {
  t: (key: string) => string
  entity: (Student & { user: User }) | (Teacher & { user: User })
  post: Post
  comment: Comment
  user: User
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"small-icon"} variant="outline">
          <Icons.replyComment className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 md:min-w-[500px] lg:min-w-[800px]">
        <SheetHeader className="my-2 rounded-lg border p-4 pt-6">
          <div className="flex items-center gap-x-3">
            <Image
              src={user.image!}
              alt={user.name!}
              width={300}
              height={300}
              className="size-10 flex-none rounded-full"
            />
            <div className="flex items-center space-x-2">
              <h3 className="flex-auto truncate text-sm font-semibold capitalize leading-6 text-secondary-foreground">
                {user.name}
              </h3>
              <span className="mx-1">•</span>
              <time
                dateTime={post.createdAt.toString()}
                className="flex-none text-xs text-secondary-foreground/50"
              >
                {formatDate(new Date(comment.createdAt), t)}
              </time>
            </div>
          </div>
          <p className="mt-3 truncate text-sm text-secondary-foreground/80">
            {comment.text}
          </p>
        </SheetHeader>
        <ul className=" flex flex-1 flex-col gap-2 overflow-y-auto ">
          {comment.replies && comment.replies.length > 0 ? (
            comment.replies
              .sort((a, b) => {
                return (
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
                )
              })
              .map((reply) => (
                <Reply
                  key={reply.id}
                  reply={reply}
                  post={post}
                  t={t}
                  entity={entity}
                />
              ))
          ) : (
            <div className="flex flex-1 flex-col justify-center">
              <div className="flex flex-col">
                <div className="block w-full flex-grow rounded-lg border-2 border-dashed border-secondary-foreground/20 p-12 text-center transition-all duration-300 hover:border-secondary-foreground/50">
                  <Icons.add className="mx-auto size-24 text-secondary-foreground/60 max-sm:size-16" />
                  <span className="text-md mt-2 block font-semibold text-secondary-foreground max-sm:text-sm">
                    {t("placeholder-empty")}
                  </span>
                  <p className="mt-2 block text-sm font-normal text-secondary-foreground/60 max-sm:text-xs">
                    {t("placeholder-empty-description")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ul>

        <SheetFooter className="mt-2 ">
          <div className="w-full">
            <FeedClassroomPostAddComment
              post={post}
              entity={entity}
              parentId={comment.id}
            />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function FeedClassroomCommentSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

export function FeedClassroomPostComment({
  entity,
  comment,
  post,
}: FeedClassroomPostCommentProps) {
  const [user, setUser] = React.useState(comment.user)
  const [isLoading, setIsLoading] = React.useState(true)
  const [date, setDate] = React.useState(comment.createdAt)

  const t = useTranslations("app.components.app.feed-classroom-post-comment")

  React.useEffect(() => {
    async function fetchData() {
      if (!user) {
        setIsLoading(true)
        try {
          const data = (await getComment(comment.postId, comment.id))!
          setIsLoading(false)
          setUser(data.user as User)
          setDate(data.createdAt)
        } catch (error) {
          console.log(error)
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  return (
    <li key={post.id} className="py-4">
      <div className="flex items-center gap-x-3">
        {isLoading ? (
          <Skeleton className="h-6 w-6 rounded-full" />
        ) : (
          <Image
            src={user.image!}
            alt={user.name!}
            width={24}
            height={24}
            className="h-6 w-6 flex-none rounded-full"
          />
        )}
        <div className="flex items-center space-x-2">
          <h3 className="flex-auto truncate text-sm font-semibold capitalize leading-6 text-secondary-foreground">
            {user.name}
          </h3>
          <span className="mx-1">•</span>
          {isLoading ? (
            <Skeleton className="h-4 w-16" />
          ) : (
            <time
              dateTime={date.toString()}
              className="flex-none text-xs text-secondary-foreground/50"
            >
              {formatDate(new Date(date), t)}
            </time>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <ReplyComment
            t={t}
            entity={entity}
            post={post}
            comment={comment}
            user={user}
          />
          {comment.userId === entity.user.id && (
            <DropdownActions t={t} comment={comment} post={post} />
          )}
        </div>
      </div>
      <p className="mt-3 text-sm text-secondary-foreground/80">
        {comment.text}
      </p>
    </li>
  )
}
