import { Post } from "@/types/classroom"

import { supabase } from "@/lib/supabase"

type Callback = (updatedPost: Post) => void

const handleReactionInserts = (payload: any, posts: Post[]) => {
  const postIndex = posts.findIndex((post) => post.id === payload.new.postId)
  return {
    ...posts[postIndex],
    reactions: [...posts[postIndex].reactions, payload.new],
  }
}

const handleReactionDeletes = (payload: any, posts: Post[]) => {
  const postIndex = posts.findIndex((post) =>
    post.reactions.some((reaction) => reaction.id === payload.old.id)
  )

  const updatedReactions = posts[postIndex].reactions.filter(
    (reaction) => reaction.id !== payload.old.id
  )

  return {
    ...posts[postIndex],
    reactions: updatedReactions,
  }
}

export function useSubscribeToReactions(posts: Post[], callback: Callback) {
  supabase
    .channel("reactions")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "reactions" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          const updatedPost = handleReactionInserts(payload, posts)
          callback(updatedPost)
        } else if (payload.eventType === "DELETE") {
          const updatedPost = handleReactionDeletes(payload, posts)
          callback(updatedPost)
        }
      }
    )
    .subscribe()
}

const handleCommentInserts = (payload: any, posts: Post[]) => {
  if (payload.new.parentId !== null) {
    return posts.map((post) => {
      if (post.id === payload.new.postId) {
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id === payload.new.parentId) {
              return {
                ...comment,
                comments: [
                  ...comment.comments,
                  { ...payload.new, reactions: [] },
                ],
              }
            }
            return comment
          }),
        }
      }
      return post
    })
  }

  return posts.map((post) => {
    if (post.id === payload.new.postId) {
      return {
        ...post,
        comments: [
          ...post.comments,
          {
            ...payload.new,
            comments: [],
            reactions: [],
          },
        ],
      }
    }
    return post
  })
}

const handleCommentDeletes = (payload: any, posts: Post[]) => {
  return posts.map((post) => {
    if (post.id === payload.old.postId) {
      return {
        ...post,
        comments: post.comments
          .map((comment) => {
            if (comment.id === payload.old.id) {
              if ("comments" in comment) {
                comment.comments = [] // Clear sub-comments if any
              }
              return null // Mark comment for deletion
            }
            return comment
          })
          .filter(Boolean), // Remove null values (i.e., marked comments)
      }
    }
    return post
  })
}

const handleCommentUpdates = (payload: any, posts: Post[]) => {
  return posts.map((post) => {
    if (post.id === payload.old.postId) {
      return {
        ...post,
        comments: post.comments.map((comment) => {
          if (comment.id === payload.old.id) {
            return {
              ...comment,
              ...payload.new, // Update comment with new data
            }
          }
          return comment
        }),
      }
    }
    return post
  })
}

export function useSubscribeToComments(posts: Post[], callback: Callback) {
  supabase
    .channel("comments")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "comments" },
      (payload) => {
        /*         if (payload.eventType === "INSERT") {
          const updatedPost = handleCommentInserts(payload, posts)
          callback(updatedPost)
        } else if (payload.eventType === "DELETE") {
          const updatedPost = handleCommentDeletes(payload, posts)
          callback(updatedPost)
        } else if (payload.eventType === "UPDATE") {
          const updatedPost = handleCommentUpdates(payload, posts)
          callback(updatedPost)
        } */
      }
    )
    .subscribe()

  return () => {
    supabase.channel("comments").unsubscribe()
  }
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
