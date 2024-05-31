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
  const postIndex = posts.findIndex((post) => post.id === payload.new.postId)

  if (payload.new.parentId !== null) {
    const commentIndex = posts[postIndex].comments.findIndex(
      (comment) => comment.id === payload.new.parentId
    )

    const updatedComments = (
      posts[postIndex].comments[commentIndex].comments || []
    ).concat([{ ...payload.new, reactions: [] }])

    return {
      ...posts[postIndex],
      comments: {
        ...posts[postIndex].comments,
        [commentIndex]: {
          ...posts[postIndex].comments[commentIndex],
          comments: updatedComments,
        },
      },
    }
  }

  const updatedComments = (posts[postIndex].comments || []).concat([
    {
      ...payload.new,
      comments: [],
      reactions: [],
    },
  ])

  return {
    ...posts[postIndex],
    comments: updatedComments,
  }
}

const handleCommentDeletes = (payload: any, posts: Post[]) => {
  const commentIdToDelete = payload.old.id

  const postIndex = posts.findIndex((post) =>
    post.comments.some((comment) => comment.id === commentIdToDelete)
  )

  const commentIndex = posts[postIndex].comments.findIndex(
    (comment) => comment.id === commentIdToDelete
  )

  posts[postIndex].comments.splice(commentIndex, 1)

  return {
    ...posts[postIndex],
    comments: posts[postIndex].comments,
  }
}

const handleCommentUpdates = (payload: any, posts: Post[]) => {
  const commentIdToUpdate = payload.old.id

  const postIndex = posts.findIndex(
    (post) =>
      Array.isArray(post.comments) &&
      post.comments.some((comment) => comment.id === commentIdToUpdate)
  )

  const commentIndex = posts[postIndex].comments.findIndex(
    (comment) => comment.id === commentIdToUpdate
  )

  const updatedComment = {
    ...posts[postIndex].comments[commentIndex],
    ...payload.new,
  }

  const updatedComments = posts[postIndex].comments.map((comment) =>
    comment.id === commentIdToUpdate ? updatedComment : comment
  )

  return {
    ...posts[postIndex],
    comments: updatedComments,
  }
}

export function useSubscribeToComments(posts: Post[], callback: Callback) {
  supabase
    .channel("comments")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "comments" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          const updatedPost = handleCommentInserts(payload, posts)
          callback(updatedPost)
        } else if (payload.eventType === "DELETE") {
          const updatedPost = handleCommentDeletes(payload, posts)
          callback(updatedPost)
        } else if (payload.eventType === "UPDATE") {
          const updatedPost = handleCommentUpdates(payload, posts)
          callback(updatedPost)
        }
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
