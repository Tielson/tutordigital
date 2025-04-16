"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

// Helper function to generate a slug from a title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .trim()
}

// Create a new blog post
export async function createBlogPost(formData: FormData) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = (formData.get("excerpt") as string) || null
  const published = formData.has("published")

  if (!title || !content) {
    throw new Error("Title and content are required")
  }

  const slug = generateSlug(title)
  const supabase = createServerSupabaseClient()

  // Check if slug already exists
  const { data: existingPost } = await supabase.from("blog_posts").select("id").eq("slug", slug).single()

  if (existingPost) {
    throw new Error("A post with a similar title already exists")
  }

  const now = new Date().toISOString()
  const publishedAt = published ? now : null

  const { error, data } = await supabase
    .from("blog_posts")
    .insert({
      title,
      content,
      slug,
      excerpt,
      published,
      published_at: publishedAt,
      author_id: userId,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/blog")
  revalidatePath("/dashboard/blog")

  return { success: true, post: data }
}

// Update an existing blog post
export async function updateBlogPost(postId: string, formData: FormData) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = (formData.get("excerpt") as string) || null
  const published = formData.has("published")

  if (!title || !content) {
    throw new Error("Title and content are required")
  }

  const supabase = createServerSupabaseClient()

  // Get the current post to check ownership and get the current slug
  const { data: currentPost, error: fetchError } = await supabase
    .from("blog_posts")
    .select("slug, author_id, published")
    .eq("id", postId)
    .single()

  if (fetchError || !currentPost) {
    throw new Error("Post not found")
  }

  // Check if user is the author
  if (currentPost.author_id !== userId) {
    throw new Error("You don't have permission to edit this post")
  }

  const now = new Date().toISOString()
  const wasPublished = currentPost.published
  const isNowPublished = published && !wasPublished
  const publishedAt = isNowPublished ? now : null

  // Update the post
  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      content,
      excerpt,
      published,
      published_at: isNowPublished ? publishedAt : undefined,
      updated_at: now,
    })
    .eq("id", postId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/blog")
  revalidatePath(`/blog/${currentPost.slug}`)
  revalidatePath("/dashboard/blog")

  return { success: true }
}

// Delete a blog post
export async function deleteBlogPost(postId: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }

  const supabase = createServerSupabaseClient()

  // Get the post to check ownership
  const { data: post, error: fetchError } = await supabase
    .from("blog_posts")
    .select("author_id")
    .eq("id", postId)
    .single()

  if (fetchError || !post) {
    throw new Error("Post not found")
  }

  // Check if user is the author
  if (post.author_id !== userId) {
    throw new Error("You don't have permission to delete this post")
  }

  // Delete the post
  const { error } = await supabase.from("blog_posts").delete().eq("id", postId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/blog")
  revalidatePath("/dashboard/blog")

  return { success: true }
}

// Toggle publish status of a blog post
export async function togglePublishStatus(postId: string) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error("Unauthorized")
  }

  const supabase = createServerSupabaseClient()

  // Get the current post to check ownership and current publish status
  const { data: post, error: fetchError } = await supabase
    .from("blog_posts")
    .select("author_id, published")
    .eq("id", postId)
    .single()

  if (fetchError || !post) {
    throw new Error("Post not found")
  }

  // Check if user is the author
  if (post.author_id !== userId) {
    throw new Error("You don't have permission to update this post")
  }

  const now = new Date().toISOString()
  const newPublishedStatus = !post.published
  const publishedAt = newPublishedStatus && !post.published ? now : null

  // Update the publish status
  const { error } = await supabase
    .from("blog_posts")
    .update({
      published: newPublishedStatus,
      published_at: newPublishedStatus ? publishedAt : null,
      updated_at: now,
    })
    .eq("id", postId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/blog")
  revalidatePath("/dashboard/blog")

  return { success: true, published: newPublishedStatus }
}
