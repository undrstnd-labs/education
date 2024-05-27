import { Post } from "@/types/classroom"

import { supabase } from "@/lib/supabase"

type Callback = (updatedPost: Post) => void
type Callbacks = (updatedPosts: Post[]) => void

const handleReactionInserts = (payload: any, post: Post) => {
  return {
    ...post,
    reactions: [...post.reactions, payload.new],
  }
}

const handleReactionDeletes = (payload: any, post: Post) => {
  return {
    ...post,
    reactions: post.reactions.filter(
      (reaction) => reaction.id !== payload.old.id
    ),
  }
}

export function useSubscribeToReactions(post: Post, callback: Callback) {
  supabase
    .channel("reactions")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "reactions" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          const updatedPost = handleReactionInserts(payload, post)
          callback(updatedPost)
        } else if (payload.eventType === "DELETE") {
          const updatedPost = handleReactionDeletes(payload, post)
          callback(updatedPost)
        }
      }
    )
    .subscribe()
}

const handleCommentInserts = (payload: any, post: Post) => {
  if (payload.new.parentId != null) {
    return {
      ...post,
      comments: post.comments.map((comment) => {
        if (comment.id === payload.new.parentId) {
          return {
            ...comment,
            replies: [...comment?.replies, { ...payload.new, reactions: [] }],
          }
        }
        return comment
      }),
    }
  }

  console.log(post)
  console.log(payload.new)
  return {
    ...post,
    comments: [...post?.comments, { ...payload.new, reactions: [] }],
  }
}

const handleCommentDeletes = (payload: any, post: Post) => {
  return {
    ...post,
    comments: post.comments.filter((comment) => comment.id !== payload.old.id),
  }
}

const handleCommentUpdates = (payload: any, post: Post) => {
  return {
    ...post,
    comments: post.comments.map((comment) => {
      if (comment.id === payload.new.id) {
        console.log(payload.new)
        console.log(comment)
        return payload.new
      }
      return comment
    }),
  }
}

export function useSubscribeToComments(post: Post, callback: Callback) {
  supabase
    .channel("comments")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "comments" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          const updatedPost = handleCommentInserts(payload, post)
          callback(updatedPost)
        } else if (payload.eventType === "DELETE") {
          const updatedPost = handleCommentDeletes(payload, post)
          callback(updatedPost)
        } else if (payload.eventType === "UPDATE") {
          const updatedPost = handleCommentUpdates(payload, post)
          callback(updatedPost)
        }
      }
    )
    .subscribe()
}

const handlePostInserts = (payload: any, posts: Post[]) => {
  return [
    ...posts,
    {
      ...payload.new,
      createdAt: new Date().toISOString(),
    },
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

const handlePostDeletes = (payload: any, posts: Post[]) => {
  return posts.filter((post) => post.id !== payload.old.id)
}

const handlePostUpdates = (payload: any, posts: Post[]) => {
  return posts.map((post) => {
    if (post.id === payload.new.id) {
      return {
        ...post,
        name: payload.new.name,
        content: payload.new.content,
      }
    }
    return post
  })
}

export function useSubscribeToPosts(
  posts: Post[],
  callback: (newPosts: Post[]) => void
) {
  return supabase
    .channel("posts")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "posts" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          const updatedPosts = handlePostInserts(payload, posts)
          callback(updatedPosts)
        } else if (payload.eventType === "DELETE") {
          const updatedPosts = handlePostDeletes(payload, posts)
          callback(updatedPosts)
        } else if (payload.eventType === "UPDATE") {
          const updatedPosts = handlePostUpdates(payload, posts)
          callback(updatedPosts)
        }
      }
    )
    .subscribe()
}
