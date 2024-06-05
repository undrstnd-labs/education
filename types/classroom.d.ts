import {
  Classroom,
  Comment as CommentPrisma,
  File,
  Post as PostPrisma,
  Reaction,
  User,
} from "@prisma/client"

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

export type Comment = CommentPrisma & {
  user: User
  reactions: Reaction[]
  replies: Comment[]
}
