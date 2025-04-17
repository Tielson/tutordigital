"use client"

import { MarkdownEditor } from "@/app/components/markdown-editor"
import { Button } from "@/app/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Switch } from "@/app/components/ui/switch"
import { Textarea } from "@/app/components/ui/textarea"
import { createBlogPost, updateBlogPost } from "@/app/dashboard/blog/actions"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  excerpt: z.string().optional(),
  published: z.boolean().optional(), // Permitir que seja opcional
})

interface BlogPostFormProps {
  post?: {
    id: string
    title: string
    content: string
    excerpt?: string | null
    published: boolean
  }
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      published: post?.published || false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", values.title)
      formData.append("content", values.content)

      if (values.excerpt) {
        formData.append("excerpt", values.excerpt)
      }

      if (values.published) {
        formData.append("published", "true")
      }

      if (post?.id) {
        // Update existing post
        await updateBlogPost(post.id, formData)
        toast({
          title: "Post updated",
          description: "Your blog post has been updated successfully.",
        })
      } else {
        // Create new post
        await createBlogPost(formData)
        toast({
          title: "Post created",
          description: "Your blog post has been created successfully.",
        })
        form.reset()
      }

      router.push("/dashboard/blog")
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while saving the post.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <Form {...form}>
      <motion.form
        initial="hidden"
        animate="visible"
        variants={formVariants}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-200">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter post title"
                    {...field}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-200">Excerpt (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief summary of your post"
                    {...field}
                    value={field.value || ""}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </FormControl>
                <FormDescription className="dark:text-gray-400">
                  A short summary that will be displayed in the blog list.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-200">Content</FormLabel>
                <FormControl>
                  <MarkdownEditor initialValue={field.value} onChange={field.onChange} minHeight="400px" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={formItemVariants}>
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 dark:border-gray-700">
                <div className="space-y-0.5">
                  <FormLabel className="text-base dark:text-gray-200">Publish</FormLabel>
                  <FormDescription className="dark:text-gray-400">Make this post visible to the public</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={formItemVariants} className="flex gap-2">
          <Button type="submit" disabled={isSubmitting} className="gap-1">
            {isSubmitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {post?.id ? "Update Post" : "Create Post"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/blog")}
            className="dark:border-gray-700 dark:text-gray-200"
          >
            Cancel
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  )
}
