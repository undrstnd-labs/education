import { Classroom, Comment, File, Post, Reaction, User } from "@prisma/client";
export type classroom = Classroom & {
  teacher: { user: User; id: string; userId: string };
  posts: post[];
};

export type post = Post & {
  teacher: { user: User; id: string; userId: string };
  files: File[];
  comments: Comment[] & {
    user: User;
  };
  reactions: Reaction[];
};
