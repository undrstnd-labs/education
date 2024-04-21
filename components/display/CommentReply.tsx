import React from "react"
import Image from "next/image"

import { comment } from "@/types/classroom"

import { emojis } from "@/config/emojis"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card"
import ReactionButton from "./ReactionButton"

interface CommentReplyProps {
  userId: string
  comment: comment
}

const CommentReply = ({ comment, userId }: CommentReplyProps) => {
  const reactionCounts = comment.reactions.reduce(
    (acc: { [x: string]: any }, reaction: { reactionType: string }) => {
      const icon = emojis.find((icon) => icon.value === reaction.reactionType)
      if (icon) {
        acc[icon.value] = (acc[icon.value] || 0) + 1
      }
      return acc
    },
    {} as { [key: string]: number }
  )
  return (
    <Card>
      <CardHeader className="pt-2">
        <CardTitle>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={comment.user.image!}
                alt={comment.user.name!}
                width={16}
                height={16}
                className="size-6"
              />
              <div className="flex flex-col ">
                <div className="text-sm">{comment.user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {comment.user.email}
                </div>
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="text-start">{comment.text}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 max-md:grid max-md:grid-cols-3">
          {emojis.map((icon, index) => {
            const count = reactionCounts[icon.value] || 0
            return (
              <ReactionButton
                userId={userId}
                icon={icon}
                key={index}
                count={count}
                commentId={comment.id}
                value={icon.value}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default CommentReply
