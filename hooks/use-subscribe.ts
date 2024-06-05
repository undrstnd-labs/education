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

  if (payload.new.parentId) {
    if (posts[postIndex] && Array.isArray(posts[postIndex].comments)) {
      const commentIndex = posts[postIndex].comments.findIndex(
        (comment) => comment.id === payload.new.parentId
      )

      const updatedComments = (
        posts[postIndex].comments[commentIndex].replies || []
      ).concat([{ ...payload.new, reactions: [] }])

      return {
        ...posts[postIndex],
        comments: [
          ...posts[postIndex].comments.slice(0, commentIndex),
          {
            ...posts[postIndex].comments[commentIndex],
            replies: updatedComments,
          },
          ...posts[postIndex].comments.slice(commentIndex + 1),
        ],
      }
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

  const postIndex = posts.findIndex(
    (post) =>
      Array.isArray(post.comments) &&
      post.comments.some(
        (comment) =>
          comment.id === commentIdToDelete ||
          comment.replies.some((reply: any) => reply.id === commentIdToDelete)
      )
  )

  const updatedComments = posts[postIndex].comments
    .map((comment: any) => {
      if (comment.id === commentIdToDelete) {
        return null
      } else {
        const updatedReplies = comment.replies.filter(
          (reply: any) => reply.id !== commentIdToDelete
        )
        return {
          ...comment,
          replies: updatedReplies,
        }
      }
    })
    .filter((comment: any) => comment !== null)

  return {
    ...posts[postIndex],
    comments: updatedComments,
  }
}

const handleCommentUpdates = (payload: any, posts: Post[]) => {
  const commentIdToUpdate = payload.new

  let postIndex = 0
  if (commentIdToUpdate.parentId) {
    postIndex = posts.findIndex(
      (post) =>
        Array.isArray(post.comments) &&
        post.comments.some(
          (comment) => comment.id === commentIdToUpdate.parentId
        )
    )
    const parentCommentIndex = posts[postIndex].comments.findIndex(
      (comment) => comment.id === commentIdToUpdate.parentId
    )

    const childCommentIndex = posts[postIndex].comments[
      parentCommentIndex
    ].replies.findIndex((comment: any) => comment.id === commentIdToUpdate.id)

    const updatedComment = {
      ...posts[postIndex].comments[parentCommentIndex].replies[
        childCommentIndex
      ],
      ...payload.new,
    }

    const updatedComments = posts[postIndex].comments[
      parentCommentIndex
    ].replies.map((comment: any) =>
      comment.id === commentIdToUpdate.id ? updatedComment : comment
    )

    const updatedParentComment = {
      ...posts[postIndex].comments[parentCommentIndex],
      replies: updatedComments,
    }

    return {
      ...posts[postIndex],
      comments: [
        ...posts[postIndex].comments.slice(0, parentCommentIndex),
        updatedParentComment,
        ...posts[postIndex].comments.slice(parentCommentIndex + 1),
      ],
    }
  } else {
    postIndex = posts.findIndex(
      (post) =>
        Array.isArray(post.comments) &&
        post.comments.some((comment) => comment.id === commentIdToUpdate.id)
    )

    const commentIndex = posts[postIndex].comments.findIndex(
      (comment) => comment.id === commentIdToUpdate.id
    )

    const updatedComment = {
      ...posts[postIndex].comments[commentIndex],
      ...payload.new,
    }

    return {
      ...posts[postIndex],
      comments: [
        ...posts[postIndex].comments.slice(0, commentIndex),
        updatedComment,
        ...posts[postIndex].comments.slice(commentIndex + 1),
      ],
    }
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
