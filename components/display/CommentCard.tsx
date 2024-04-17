import { comment } from "@/types/classroom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import Image from "next/image";
import { Button } from "../ui/Button";
import { Icons } from "../icons/Lucide";
import ReactionButton from "./ReactionButton";
import { icons } from "@/constants";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/Sheet";
import { Label } from "../ui/Label";
import CommentReply from "./CommentReply";
import CommentAddCard from "../showcase/CommentAddCard";
import { useTranslations } from "next-intl";
interface CommentCardProps {
  userId: string;
  comment: comment;
  postId: string;
}

const CommentCard = ({ userId, comment, postId }: CommentCardProps) => {
  const t = useTranslations("Pages.Classroom");
  const reactionCounts = comment.reactions.reduce(
    (acc, reaction) => {
      const icon = icons.find((icon) => icon.value === reaction.reactionType);
      if (icon) {
        acc[icon.value] = (acc[icon.value] || 0) + 1;
      }
      return acc;
    },
    {} as { [key: string]: number }
  );

  return (
    <Card>
      <CardHeader className="pt-2">
        <CardTitle>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
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
            <Button
              type="submit"
              size={"icon"}
              variant={"outline"}
              className="border rounded-full w-7 h-7 max-sm:size-5 flex justify-center items-center
                       border-gray-500 hover:bg-accent"
            >
              <Sheet>
                <SheetTrigger asChild>
                  <Icons.replyComment className="size-5 text-gray-500 max-sm:size-4 " />
                </SheetTrigger>
                <SheetContent className="flex flex-col gap-4  md:min-w-[500px] lg:min-w-[800px]">
                  <SheetHeader className="pt-6">
                    <CommentReply comment={comment} userId={userId} />
                  </SheetHeader>
                  <Label className="py-2 font-bold">{t("repliesLabel")}</Label>

                  <div className=" flex flex-1 flex-col gap-2 overflow-y-auto  ">
                    {comment.replies && comment.replies.length > 0 ? (
                      comment.replies.map((reply) => {
                        return (
                          <CommentReply
                            key={reply.id}
                            comment={reply}
                            userId={userId}
                          />
                        );
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
        </CardTitle>
        <CardDescription>{comment.text}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-sm:grid max-sm:grid-cols-3 flex gap-2">
          {icons.map((icon, index) => {
            const count = reactionCounts[icon.value] || 0;
            return (
              <ReactionButton
                userId={userId}
                icon={icon}
                key={index}
                count={count}
                commentId={comment.id}
                value={icon.value}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
