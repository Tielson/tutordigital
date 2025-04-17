"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { formatDate } from "@/app/lib/utils"
import { motion } from "framer-motion"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"

interface BlogPostCardProps {
  post: {
    title: string
    excerpt?: string | null
    slug: string
    published_at: string | null
    created_at: string
  }
  index: number
}

export function BlogPostCard({ post, index }: BlogPostCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <Card className="h-full overflow-hidden transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl line-clamp-2 dark:text-white">{post.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 text-sm dark:text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.published_at || post.created_at)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-muted-foreground line-clamp-3 dark:text-gray-300">
              {post.excerpt || "Read this blog post to learn more..."}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex items-center text-sm font-medium text-primary dark:text-sky-400">
              Read more <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
