import Image from "next/image"

import { post } from "@/types/classroom"

import { emojis } from "@/config/emojis"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import CommentCard from "@/components/display/CommentCard"
import ReactionButton from "@/components/display/ReactionButton"
import CommentAddCard from "@/components/showcase/CommentAddCard"
import { FileCard } from "@/components/showcase/FileCard"

interface PostCardProps {
  post: post
  userId: string
}

const PostCard = ({ post, userId }: PostCardProps) => {
  const reactionCounts = post.reactions.reduce(
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
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Image
                src={post.teacher.user.image!}
                alt={post.teacher.user.name!}
                width={16}
                height={16}
                className="size-6"
              />
              <div className="flex flex-col ">
                <div className="text-sm">{post.teacher.user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {post.teacher.user.email}
                </div>
              </div>
            </div>
          </CardTitle>
          <CardDescription>{post.content}</CardDescription>
          {post.files && post.files.length > 0 && (
            <div className="grid grid-cols-1 gap-4 pt-0.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {post.files.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 max-sm:grid max-sm:grid-cols-3">
            {emojis.map((icon, index) => {
              const count = reactionCounts[icon.value] || 0
              return (
                <ReactionButton
                  key={index}
                  userId={userId}
                  icon={icon}
                  postId={post.id}
                  count={count}
                  value={icon.value}
                />
              )
            })}
          </div>
        </CardContent>
      </Card>
      {post.comments &&
        post.comments.length > 0 &&
        post.comments.map((comment) => {
          return !comment.parentId ? (
            <CommentCard
              key={comment.id}
              comment={comment}
              userId={userId}
              postId={post.id}
            />
          ) : null
        })}
      <div>
        <CommentAddCard postId={post.id} userId={userId} />
      </div>
    </div>
  )
}

export default PostCard
