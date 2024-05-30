"use client"

import React, { useEffect, useState } from "react"
import {
  Comment,
  Post,
  Reaction,
  ReactionType,
  Student,
  Teacher,
} from "@prisma/client"
import { useTranslations } from "next-intl"

import { ReactionIcon } from "@/types/icon"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  addReactionComment,
  addReactionPost,
  checkReactionComment,
  checkReactionPost,
  removeReactionComment,
  removeReactionPost,
} from "@/undrstnd/reaction"

interface ReactionButtonPostProps {
  icon: ReactionIcon
  post: Post & { reactions: Reaction[] }
  entity: Student | Teacher
  reactions: { [key: string]: number }
}

interface ReactionButtonCommentProps {
  icon: ReactionIcon
  comment: Comment & { reactions: Reaction[] }
  entity: Student | Teacher
  reactions: { [key: string]: number }
}

export function FeedClassroomPostReactionsSkeleton() {
  return (
    <div className="flex gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-10" />
      ))}
    </div>
  )
}

export function FeedClassroomPostReactions({
  icon,
  post,
  entity,
  reactions,
}: ReactionButtonPostProps) {
  const [isReacted, setIsReacted] = useState<Reaction | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations("app.components.app.feed-classroom-post-reactions")

  useEffect(() => {
    function checkIsReacted() {
      return (
        post.reactions.find(
          (reaction) =>
            reaction.reactionType.toString() === icon.value &&
            reaction.userId === entity.userId
        ) || null
      )
    }

    setIsReacted(checkIsReacted())
  }, [post.reactions])

  const handleAddReaction = async () => {
    setIsLoading(true)
    await addReactionPost(entity.userId, post, icon.value as ReactionType)
    setIsLoading(false)
  }

  const handleRemoveReaction = async () => {
    setIsLoading(true)
    await removeReactionPost(
      entity.userId,
      isReacted!.id,
      post,
      icon.value as ReactionType
    )
    setIsReacted(null)
    setIsLoading(false)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {isReacted ? (
          <Button
            disabled={isLoading}
            onClick={handleRemoveReaction}
            variant="secondary"
            size="sm"
            style={{
              border: "0.25px solid",
              borderColor: icon.color,
            }}
          >
            <icon.Icon
              style={{
                color: icon.color,
              }}
              className={cn(`size-4 max-sm:size-3`)}
            />

            <span
              className={cn("ml-2 text-xs font-semibold max-sm:text-[10px]")}
            >
              {reactions[icon.value]}
            </span>
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            onClick={handleAddReaction}
            variant="outline"
            size="sm"
          >
            <icon.Icon className={cn(`size-4 max-sm:size-3`)} />

            {reactions[icon.value] && (
              <span
                className={cn("ml-2 text-xs font-semibold max-sm:text-[10px]")}
              >
                {reactions[icon.value]}
              </span>
            )}
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p style={{ color: icon.color }}> {t(`${icon.value}`)} </p>
      </TooltipContent>
    </Tooltip>
  )
}

export function FeedClassroomCommentReactions({
  icon,
  comment,
  entity,
  reactions,
}: ReactionButtonCommentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations("app.components.app.feed-classroom-post-reactions")

  function isReacted() {
    return comment.reactions.find(
      (reaction) =>
        reaction.reactionType.toString() === icon.value &&
        reaction.userId === entity.userId
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true)
            const isReactedCheck = await checkReactionComment(
              entity.userId,
              comment.id,
              icon.value as ReactionType
            )
            if (!isReacted() || !isReactedCheck) {
              await addReactionComment(
                entity.userId,
                comment,
                icon.value as ReactionType
              )
            } else {
              try {
                await removeReactionComment(
                  entity.userId,
                  // @ts-ignore: Object is possibly 'null'.
                  isReacted().id,
                  comment,
                  icon.value as ReactionType
                )
              } catch (error) {
                console.error(error)
              }
            }
            setIsLoading(false)
          }}
          variant={isReacted() ? "secondary" : "outline"}
          size={"sm"}
          style={{
            border: "0.25px solid",
            borderColor: isReacted() ? icon.color : "text-secondary-foreground",
          }}
        >
          <icon.Icon
            style={{
              color: isReacted() ? icon.color : "text-secondary-foreground",
            }}
            className={cn(`size-3`)}
          />

          {reactions[icon.value] && (
            <span
              className={cn("ml-2 text-xs font-semibold max-sm:text-[10px]")}
            >
              {reactions[icon.value]}
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p style={{ color: icon.color }}> {t(`${icon.value}`)} </p>
      </TooltipContent>
    </Tooltip>
  )
}
