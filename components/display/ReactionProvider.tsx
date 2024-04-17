"use client";
import { useRouter } from "@/lib/navigation";
import React from "react";

const ReactionProvider = ({
  children,
  userId,
  commentId,
  postId,
  value,
  reactionId,
}: {
  children: React.ReactNode;
  userId: string;
  commentId?: string;
  postId?: string;
  value: string;
  reactionId: string | null;
}) => {
  const router = useRouter();
  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          postId,
          commentId,
          reactionType: value,
        }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/reactions/${reactionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div onClick={reactionId ? handleDelete : handleSubmit}>{children}</div>
  );
};

export default ReactionProvider;
