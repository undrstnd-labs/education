"use client"

import React, { useEffect, useState } from "react"
import { Role, Student, Teacher, User } from "@prisma/client"
import { useTranslations } from "next-intl"

import { Classroom } from "@/types/classroom"

import {
  useSubscribeToComments,
  useSubscribeToPosts,
  useSubscribeToReactions,
} from "@/hooks/use-subscribe"

import {
  FeedClassroomAddPost,
  FeedClassroomAddPostTrigger,
} from "@/components/app/feed-classroom-add-post"
import { FeedClassroomPostCard } from "@/components/app/feed-classroom-post-card"
import { Icons } from "@/components/shared/icons"

import { getPost } from "@/undrstnd/post"

interface FeedClassroomPostsProps {
  classroom: Classroom
  role: Role
  entity: (Student & { user: User }) | (Teacher & { user: User })
}

export function FeedClassroomPosts({
  classroom,
  role,
  entity,
}: FeedClassroomPostsProps) {
  const t = useTranslations("app.pages.classroom")
  const [posts, setPosts] = useState(classroom.posts)

  useEffect(() => {
    const subscription = useSubscribeToPosts(posts, (newPosts) => {
      setPosts(newPosts)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [posts])

  useEffect(() => {
    useSubscribeToReactions(posts, (newPost) => {
      const index = posts.findIndex((post) => post.id === newPost.id)
      const updatedPosts = [...posts]
      updatedPosts[index] = newPost
      setPosts(updatedPosts)
    })
  }, [posts])

  useEffect(() => {
    useSubscribeToComments(posts, async (newPost) => {
      const updatedPosts = [...posts]
      if (newPost.teacher) {
        const index = posts.findIndex((post) => post.id === newPost.id)
        updatedPosts[index] = newPost
        setPosts(updatedPosts)
      } else {
        const fetchedPost = await getPost(newPost.id)
        if (fetchedPost) {
          const index = posts.findIndex((post) => post.id === newPost.id)
          updatedPosts[index] = fetchedPost
          setPosts(updatedPosts)
        }
      }
    })
  }, [posts])

  return (
    <>
      {role === "TEACHER" && posts.length > 0 && (
        <FeedClassroomAddPost teacher={entity} classroom={classroom} />
      )}

      <div className="flex flex-col gap-6">
        {posts && posts.length > 0 ? (
          posts.map((post: any) => (
            <FeedClassroomPostCard
              key={post.id}
              post={post}
              posts={posts}
              classroom={classroom}
              role={role}
              entity={entity}
            />
          ))
        ) : (
          <>
            {role === "TEACHER" && (
              <div className="flex flex-col">
                <div className="block w-full flex-grow rounded-lg border-2 border-dashed border-secondary-foreground/20 p-12 text-center transition-all duration-300 hover:border-secondary-foreground/50">
                  <Icons.add className="mx-auto size-24 text-secondary-foreground/60" />
                  <span className="text-md mt-2 block font-semibold text-secondary-foreground">
                    {t("add-post")}
                  </span>
                  <p className="mt-2 block text-sm font-normal text-secondary-foreground/60">
                    {t("add-post-description")}
                  </p>
                  <div className="py-6">
                    <FeedClassroomAddPostTrigger
                      teacher={entity}
                      classroom={classroom}
                    />
                  </div>
                </div>
              </div>
            )}

            {role === "STUDENT" && (
              <div className="flex flex-col">
                <div className="block w-full flex-grow rounded-lg border-2 border-dashed border-secondary-foreground/20 p-12 text-center transition-all duration-300 hover:border-secondary-foreground/50">
                  <Icons.sleep className="mx-auto size-24 text-secondary-foreground/60" />
                  <span className="text-md mt-2 block font-semibold text-secondary-foreground">
                    {t("nothing-title")}
                  </span>
                  <p className="mt-2 block text-sm font-normal text-secondary-foreground/60">
                    {t("nothing-paragraph")}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
