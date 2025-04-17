"use client"

import { StudentDetailModal } from "@/components/student-detail-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { createClientSupabaseClient } from "@/lib/supabase"
import { formatDate } from "@/lib/utils"
import type { Database } from "@/types/supabase"
import { motion } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"
import { useState } from "react"

type Student = Database["public"]["Tables"]["students"]["Row"]

interface StudentListProps {
  students: Student[]
}

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

export function StudentList({ students: initialStudents }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const { toast } = useToast()

  const toggleStudentStatus = async (student: Student) => {
    try {
      setIsUpdating(student.id)
      const supabase = createClientSupabaseClient()

      const { error } = await supabase.from("students").update({ active: !student.active }).eq("id", student.id)

      if (error) throw error

      setStudents(students.map((s) => (s.id === student.id ? { ...s, active: !s.active } : s)))

      if (selectedStudent && selectedStudent.id === student.id) {
        setSelectedStudent({ ...selectedStudent, active: !selectedStudent.active })
      }

      toast({
        title: "Status atualizado",
        description: `Aluno ${student.active ? "desativado" : "ativado"} com sucesso.`,
      })
    } catch (error) {
      console.error("Error updating student status:", error)
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do aluno.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <>
      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Série/Turma</TableHead>
              <TableHead className="hidden md:table-cell">Data de Cadastro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center dark:text-gray-400">
                  Nenhum aluno cadastrado
                </TableCell>
              </TableRow>
            ) : (
              students.map((student, index) => (
                <motion.tr
                  key={student.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tableRowVariants}
                  className={`${!student.active ? "bg-muted/40 dark:bg-gray-800/40" : "dark:bg-gray-800"} dark:text-gray-200 dark:border-gray-700`}
                >
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(student.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={student.active}
                        disabled={isUpdating === student.id}
                        onCheckedChange={() => toggleStudentStatus(student)}
                      />
                                           {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStudentStatus(student)}
                        disabled={isUpdating === student.id}
                        className="ml-2 gap-1"
                      >
                        {student.active ? (
                          <>
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span className="hidden sm:inline">Desativar</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="hidden sm:inline">Ativar</span>
                          </>
                        )}
                      </Button> */}
                      <Badge variant={student.active ? "success" : "secondary"}>
                        {student.active ? "Ativo" : "Inativo"}
                      </Badge>
 
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" onClick={() => setSelectedStudent(student)}>
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <StudentDetailModal
        student={selectedStudent}
        open={!!selectedStudent}
        onOpenChange={(open) => {
          if (!open) setSelectedStudent(null)
        }}
        onStatusChange={toggleStudentStatus}
        isUpdating={isUpdating}
      />
    </>
  )
}
