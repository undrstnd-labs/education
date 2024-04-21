import { Classroom, Comment, File, Post, Reaction, User } from "@prisma/client"

export type post = Post & {
  teacher: { user: User; id: string; userId: string }
  files: File[]
  comments: comment[]
  reactions: Reaction[]
}

export type classroom = Classroom & {
  teacher: { user: User; id: string; userId: string }
  posts: post[]
}

export type comment = Comment & {
  user: User
  reactions: Reaction[]
  replies: comment[]
}
//do not forget to wrap in () if you do a new type before [] in case of array
