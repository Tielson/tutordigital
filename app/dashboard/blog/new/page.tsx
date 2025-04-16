import { BlogPostForm } from "@/components/blog-post-form"

export default function NewBlogPostPage() {
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Create New Blog Post</h2>
        <p className="text-muted-foreground dark:text-gray-400">Write and publish a new blog post</p>
      </div>

      <div className="max-w-4xl">
        <BlogPostForm />
      </div>
    </div>
  )
}
