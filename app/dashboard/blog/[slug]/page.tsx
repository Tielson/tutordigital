import { ThemeToggle } from "@/app/components/theme-toggle"
import { Button } from "@/app/components/ui/button"
import { createServerSupabaseClient } from "@/app/lib/supabase"
import { formatDate } from "@/app/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export const revalidate = 3600 // Revalida a cada hora

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params
  const supabase = createServerSupabaseClient()

  // Buscar o post
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col relative w-full">
      {/* Gradiente animado de fundo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-indigo-50 opacity-80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 dark:opacity-100" />
        <div className="absolute -top-[40%] -right-[60%] h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-sky-100/40 to-indigo-200/40 blur-3xl dark:from-sky-900/20 dark:to-indigo-900/20" />
        <div className="absolute -bottom-[40%] -left-[60%] h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-blue-100/40 to-purple-200/40 blur-3xl dark:from-blue-900/20 dark:to-purple-900/20" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/blog" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-sky-600 dark:text-sky-400"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <h1 className="text-2xl font-bold text-sky-700 dark:text-sky-400">TutorDigital Blog</h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/blog">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Blog
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-12 mx-auto px-4">
        <article className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground mb-6 hover:text-primary dark:text-gray-400 dark:hover:text-sky-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para todas as postagens
          </Link>

          <h1 className="text-4xl font-bold tracking-tight mb-4 dark:text-white">{post.title}</h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 dark:text-gray-400">
            <time dateTime={post.published_at || post.created_at}>
              {formatDate(post.published_at || post.created_at)}
            </time>
          </div>

          <div className="prose dark:prose-invert max-w-none" >
                <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        components={{
          p: ({ children }) => <p className="mb-4">{children}</p>,
          li: ({ children }) => <li className="mb-2">{children}</li>,
        }}
      >
        {post.content}
      </ReactMarkdown>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-white/80 py-6 text-center backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} TutorDigital - Sistema de Gestão para Professor Virtual de Inglês
          </p>
        </div>
      </footer>
    </div>
  )
}
