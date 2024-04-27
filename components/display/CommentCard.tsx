import Image from "next/image"
import { useTranslations } from "next-intl"

import { comment } from "@/types/classroom"

import { emojis } from "@/config/emojis"

import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/Sheet"
import ReactionButton from "@/components/display/ReactionButton"
import CommentAddCard from "@/components/form/CommentAddCard"
import { Icons } from "@/components/icons/Lucide"
import CommentCardOptions from "@/components/showcase/CommentCardOptions"

import CommentReply from "./CommentReply"

interface CommentCardProps {
  userId: string
  comment: comment
  postId: string
}

const CommentCard = ({ userId, comment, postId }: CommentCardProps) => {
  const t = useTranslations("Pages.Classroom")
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
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              {userId === comment.user.id && (
                <CommentCardOptions
                  comment={comment}
                  postId={postId}
                  userId={userId}
                />
              )}
              <Button
                type="submit"
                size={"icon"}
                variant={"outline"}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-500
                       hover:bg-accent max-sm:size-5"
              >
                <Sheet>
                  <SheetTrigger asChild>
                    <Icons.replyComment className="size-5 text-gray-500 max-sm:size-4 " />
                  </SheetTrigger>
                  <SheetContent className="flex flex-col gap-4  md:min-w-[500px] lg:min-w-[800px]">
                    <SheetHeader className="pt-6">
                      <CommentReply
                        comment={comment}
                        userId={userId}
                        postId={postId}
                      />
                    </SheetHeader>
                    <Label className="py-2 font-bold">
                      {t("repliesLabel")}
                    </Label>

                    <div className=" flex flex-1 flex-col gap-2 overflow-y-auto  ">
                      {comment.replies && comment.replies.length > 0 ? (
                        comment.replies.map((reply) => {
                          return (
                            <CommentReply
                              key={reply.id}
                              comment={reply}
                              userId={userId}
                              postId={postId}
                            />
                          )
                        })
                      ) : (
                        <Label className="py-2 font-bold">No replies yet</Label>
                      )}
                    </div>

                    <SheetFooter className="mt-2">
                      <div className="w-full">
                        <CommentAddCard
                          postId={postId}
                          userId={userId}
                          parentid={comment.id}
                        />
                      </div>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </Button>
            </div>
          </div>
        </CardTitle>
        <CardDescription>{comment.text}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 max-sm:grid max-sm:grid-cols-3">
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

export default CommentCard
