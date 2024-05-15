import { Classroom, Comment, File, Post as PostPrisma, Reaction, User } from "@prisma/client"

export type Post = PostPrisma & {
  teacher: { user: User; id: string; userId: string }
  files: File[]
  comments: comment[]
  reactions: Reaction[]
}

export type Classroom = Classroom & {
  teacher: { user: User; id: string; userId: string }
  posts: Post[]
}

export type comment = Comment & {
  user: User
  reactions: Reaction[]
  replies: comment[]
}
