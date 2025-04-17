"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/components/ui/alert-dialog"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { deleteBlogPost, togglePublishStatus } from "@/app/dashboard/blog/actions"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface BlogPost {
  id: string
  title: string
  slug: string
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

interface BlogPostListProps {
  posts: BlogPost[]
}

export function BlogPostList({ posts: initialPosts }: BlogPostListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return

    setIsLoading(postToDelete)
    try {
      await deleteBlogPost(postToDelete)
      setPosts(posts.filter((post) => post.id !== postToDelete))
      toast({
        title: "Post deleted",
        description: "The blog post has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while deleting the post.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    }
  }

  const handleTogglePublish = async (postId: string) => {
    setIsLoading(postId)
    try {
      const result = await togglePublishStatus(postId)
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                published: result.published,
                published_at: result.published && !post.published_at ? new Date().toISOString() : post.published_at,
              }
            : post,
        ),
      )
      toast({
        title: result.published ? "Post published" : "Post unpublished",
        description: `The blog post has been ${result.published ? "published" : "unpublished"} successfully.`,
      })
    } catch (error) {
      console.error("Error toggling publish status:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while updating the post.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  // Animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-md border dark:border-gray-700"
      >
        <Table>
          <TableHeader>
            <TableRow className="dark:bg-gray-800 dark:text-gray-300">
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center dark:text-gray-400">
                  No blog posts found
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.tr
                    key={post.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={tableRowVariants}
                    className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  >
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/blog/${post.id}/edit`} className="hover:underline">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={post.published ? "success" : "secondary"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(post.created_at)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(post.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublish(post.id)}
                          disabled={isLoading === post.id}
                          className="gap-1"
                        >
                          {post.published ? (
                            <>
                              <EyeOff className="h-4 w-4" />
                              <span className="hidden sm:inline">Unpublish</span>
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" />
                              <span className="hidden sm:inline">Publish</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/blog/${post.id}/edit`)}
                          className="gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(post.id)}
                          disabled={isLoading === post.id}
                          className="gap-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </motion.div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              This action cannot be undone. This will permanently delete the blog post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
