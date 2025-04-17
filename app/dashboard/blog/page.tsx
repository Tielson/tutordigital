import { BlogPostCard } from "@/app/components/blog-post-card"
import { Button } from "@/app/components/ui/button"
import { createServerSupabaseClient } from "@/app/lib/supabase"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage() {
  const supabase = createServerSupabaseClient()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })

  return (
    <div className="flex flex-col min-h-screen relative w-full">
      {/* Gradiente de fundo */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-indigo-50 opacity-80 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 dark:opacity-100" />
        <div className="absolute -top-[40%] -right-[60%] h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-sky-100/40 to-indigo-200/40 blur-3xl dark:from-sky-900/20 dark:to-indigo-900/20" />
        <div className="absolute -bottom-[40%] -left-[60%] h-[1000px] w-[1000px] rounded-full bg-gradient-to-br from-blue-100/40 to-purple-200/40 blur-3xl dark:from-blue-900/20 dark:to-purple-900/20" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
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
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 container px-4 py-12 mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4 dark:text-white">Nosso Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto dark:text-gray-300">
            Últimas notícias, atualizações e insights educacionais da equipe TutorDigital
          </p>
        </div>

        {posts && posts?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2 dark:text-white">Nenhuma postagem ainda</h3>
            <p className="text-muted-foreground dark:text-gray-400">Volte em breve para conferir novos conteúdos!</p>
          </div>
        )}
      </main>

      {/* Rodapé */}
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

