import { createServerSupabaseClient } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogPostList } from "@/components/blog-post-list"
import { Plus } from "lucide-react"

export const revalidate = 0 // Don't cache this page

export default async function BlogManagementPage() {
  const { userId } = auth()
  if (!userId) {
    return null
  }

  const supabase = createServerSupabaseClient()

  // Fetch all blog posts for the current user
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false })

  return (
    <div className="container py-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">Blog Posts</h2>
          <p className="text-muted-foreground dark:text-gray-400">Manage your blog posts</p>
        </div>
        <Link href="/dashboard/blog/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <BlogPostList posts={posts || []} />
    </div>
  )
}
