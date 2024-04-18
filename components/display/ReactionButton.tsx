import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import ReactionProvider from "./ReactionProvider";
import { db } from "@/lib/prisma";

export type reactionIcon =
  | { Icon: LucideIcon; color: string }
  | { Icon: IconType; color: string };

interface ReactionButtonProps {
  icon: reactionIcon;
  count: number;
  postId?: string;
  commentId?: string;
  userId: string;
  value: string;
}

const ReactionButton = async ({
  icon,
  count,
  userId,
  commentId,
  postId,
  value,
}: ReactionButtonProps) => {
  const isReacted = async () => {
    const reaction = await db.reaction.findFirst({
      where: {
        postId: postId || null,
        commentId: commentId || null,
        userId,
        reactionType: value as any,
      },
    });
    if (reaction) {
      return reaction.id;
    }
    return null;
  };
  const reactionId = await isReacted();
  
  return (
    <ReactionProvider
      userId={userId}
      commentId={commentId}
      postId={postId}
      value={value}
      reactionId={reactionId}
    >
      <div
        className="flex  items-center justify-center gap-1 rounded-md 
        border border-gray-500 px-3 py-1 hover:cursor-pointer hover:bg-accent"
        style={{ borderColor: reactionId ? icon.color : "gray" }}
      >
        <icon.Icon
          className={`size-4  max-sm:size-3 `}
          style={{ color: icon.color }}
        />
        <span className="text-xs max-sm:text-[10px] ">{count}</span>
      </div>
    </ReactionProvider>
  );
};

export default ReactionButton;
