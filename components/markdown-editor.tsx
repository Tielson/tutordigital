"use client"

import type React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  initialValue?: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function MarkdownEditor({
  initialValue = "",
  onChange,
  placeholder = "Write your content in Markdown...",
  minHeight = "300px",
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialValue)
  const [activeTab, setActiveTab] = useState<string>("write")

  useEffect(() => {
    setContent(initialValue)
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setContent(newValue)
    onChange(newValue)
  }

  return (
    <div className="w-full border rounded-md dark:border-gray-700">
      <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="p-0">
          <Textarea
            value={content}
            onChange={handleChange}
            placeholder={placeholder}
            className="border-0 rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[300px] dark:bg-gray-800 dark:text-white"
            style={{ minHeight }}
          />
        </TabsContent>
        <TabsContent
          value="preview"
          className="p-4 prose dark:prose-invert max-w-none min-h-[300px] overflow-auto"
          style={{ minHeight }}
        >
          {content ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground dark:text-gray-400">Nothing to preview</p>
          )}
        </TabsContent>
      </Tabs>
      <div className="p-2 text-xs text-muted-foreground border-t dark:border-gray-700 dark:text-gray-400">
        <p>
          Supports Markdown: <strong>**bold**</strong>, <em>*italic*</em>, [link](url), # Heading, - List item, etc.
        </p>
      </div>
    </div>
  )
}
