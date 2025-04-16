import { BlogPostForm } from "@/components/blog-post-form"
import { createServerSupabaseClient } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

interface EditBlogPostPageProps {
  params: {
    id: string
  }
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = params
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const supabase = createServerSupabaseClient()

  // Fetch the blog post
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .eq("author_id", userId)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Edit Blog Post</h2>
        <p className="text-muted-foreground dark:text-gray-400">Update your blog post</p>
      </div>

      <div className="max-w-4xl">
        <BlogPostForm post={post} />
      </div>
    </div>
  )
}
