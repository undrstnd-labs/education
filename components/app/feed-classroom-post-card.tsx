"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Role, Student, Teacher, User } from "@prisma/client"
import { useTranslations } from "next-intl"

import { Classroom, Post } from "@/types/classroom"

import { emojis } from "@/config/emojis"
import { formatDate } from "@/lib/utils"

import { FeedClassroomFileCard } from "@/components/app/feed-classroom-file-card"
import { FeedClassroomPostAddComment } from "@/components/app/feed-classroom-post-add-comment"
import { FeedClassroomPostComment } from "@/components/app/feed-classroom-post-comment"
import {
  FeedClassroomPostReactions,
  FeedClassroomPostReactionsSkeleton,
} from "@/components/app/feed-classroom-post-reactions"
import { FeedClassroomPostTeacherActions } from "@/components/app/feed-classroom-post-teacher-actions"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { getPost } from "@/undrstnd/post"

interface PostCardProps {
  post: Post
  posts: Post[]
  classroom: Classroom
  entity: (Student & { user: User }) | (Teacher & { user: User })
  role: Role
}

function FileSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
      </div>
    </div>
  )
}

export function FeedClassroomPostCard({
  post: oldPost,
  posts,
  classroom,
  entity,
  role,
}: PostCardProps) {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setCurrentPost] = useState<Post>(oldPost)

  const t = useTranslations("app.components.app.feed-classroom-post-card")

  useEffect(() => {
    setCurrentPost(oldPost)
  }, [oldPost])

  // #FIXME: Make subscription to the files and check the file postId if it matches the post id and then update it
  useEffect(() => {
    const fetchDataPost = async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000))
      if (searchParams.has("loading")) {
        return
      } else {
        const newPost = await getPost(post.id)
        setCurrentPost(newPost as Post)
        setIsLoading(false)
      }
    }

    const fetchDataComment = async () => {
      const newPost = await getPost(post.id)
      setCurrentPost(newPost as Post)
      setIsLoading(false)
    }

    if (!post.teacher) {
      fetchDataPost()
    } else {
      setIsLoading(false)
    }

    if (
      !post.comments ||
      !Array.isArray(post.comments) ||
      post.comments.some((comment: any) => !comment.user)
    ) {
      fetchDataComment()
    } else {
      setIsLoading(false)
    }
  }, [post, searchParams])

  const reactions = post.reactions?.reduce(
    (acc, reaction) => {
      const icon = emojis.find((icon) => icon.value === reaction.reactionType)
      if (icon) {
        acc[icon.value] = (acc[icon.value] || 0) + 1
      }
      return acc
    },
    {} as { [key: string]: number }
  )

  return (
    <section id={post.id} className="flex flex-col gap-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Skeleton className="size-6 rounded-xl" />
              ) : (
                <Image
                  src={post.teacher.user.image!}
                  alt={post.teacher.user.name!}
                  width={16}
                  height={16}
                  className="size-6 rounded-xl"
                />
              )}

              <div className="flex flex-col">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-[60px] pb-1" />
                    <Skeleton className="h-4 w-[40px]" />
                  </>
                ) : (
                  <>
                    <div className="text-sm">{post.teacher.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(new Date(post.createdAt), t)}
                    </div>
                  </>
                )}
              </div>
            </div>
            {role === "TEACHER" && (
              <FeedClassroomPostTeacherActions
                post={post}
                teacher={entity}
                classroom={classroom}
              />
            )}
          </CardTitle>

          <CardTitle className="font-bold">{post.name}</CardTitle>
          <CardDescription>{post.content}</CardDescription>
          {isLoading ? (
            <FileSkeleton />
          ) : (
            <>
              {post.files && post.files.length > 0 && (
                <ul className="grid grid-cols-1 gap-4 pt-0.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {post.files.map((file) => (
                    <FeedClassroomFileCard
                      key={file.id}
                      file={file}
                      entity={entity}
                      role={role}
                    />
                  ))}
                </ul>
              )}
            </>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex gap-2 max-sm:grid max-sm:grid-cols-3">
            {isLoading ? (
              <FeedClassroomPostReactionsSkeleton />
            ) : (
              <>
                {emojis.map((icon, index) => {
                  return (
                    <FeedClassroomPostReactions
                      key={index}
                      icon={icon}
                      post={post}
                      entity={entity}
                      reactions={reactions}
                    />
                  )
                })}
              </>
            )}
          </div>
        </CardContent>
        <FeedClassroomPostAddComment entity={entity} post={post} />
        {isLoading ? (
          <div className="flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ) : (
          <ul className="mb-4 block items-start px-4">
            {post.comments &&
              post.comments.length > 0 &&
              post.comments.map((comment) => {
                return (
                  !comment.parentId && (
                    <FeedClassroomPostComment
                      key={comment.id}
                      entity={entity}
                      comment={comment}
                      post={post}
                    />
                  )
                )
              })}
          </ul>
        )}
      </Card>
    </section>
  )
}
