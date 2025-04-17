"use client"

import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { StudentList } from "../../../components/student-list"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { useToast } from "../../../hooks/use-toast"
import { createClientSupabaseClient } from "../../../lib/supabase"
import type { Database } from "../../../types/supabase"

type Student = Database["public"]["Tables"]["students"]["Row"]
type School = Database["public"]["Tables"]["schools"]["Row"]

interface Props {
  school: School
  search: string
  registrationLink: string
}

export default function DashboardClient({ school, search, registrationLink }: Props) {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState(search || "")
  const [isLoading, setIsLoading] = useState(true)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setSearchQuery((formData.get("q") as string) || "")
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const supabase = createClientSupabaseClient()

        let query = supabase
          .from("students")
          .select("*")
          .eq("school_id", school.id)
          .order("created_at", { ascending: false })

        if (searchQuery) {
          query = query.ilike("name", `%${searchQuery}%`)
        }

        const { data: studentsData } = await query
        setStudents(studentsData || [])
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchQuery, school.id])

  function onClick() {
    if (!registrationLink) {
      console.error("registrationLink está indefinido!")
      return
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(registrationLink)
        .then(() => {
          console.log("Link copiado para a área de transferência!")
        })
        .catch((err) => {
          console.error("Erro ao copiar o link:", err)
        })
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = registrationLink
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        console.log("Link copiado para a área de transferência!")
      } catch (err) {
        console.error("Erro ao copiar o link:", err)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <div className="container py-6 px-4 relative">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">Alunos Cadastrados</h2>
          <p className="text-muted-foreground dark:text-gray-400">Gerencie os alunos cadastrados na sua escola</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar alunos..."
              className="w-full pl-8 sm:w-[300px] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              name="q"
              defaultValue={searchQuery}
            />
          </form>
        </div>
      </motion.div>

      <div className="grid gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Link para Cadastro</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Compartilhe este link para que novos alunos possam se cadastrar na sua escola
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={registrationLink}
                  readOnly
                  onClick={(e) => e.currentTarget.select()}
                  className="bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <Button
                  onClick={() => {
                    onClick()
                    toast({
                      title: "Link copiado!",
                      description: "O link de cadastro foi copiado para a área de transferência.",
                    })
                  }}
                  className="gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  Copiar Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-40 items-center justify-center"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </motion.div>
        ) : (
          <StudentList students={students} />
        )}
      </div>
    </div>
  )
}
