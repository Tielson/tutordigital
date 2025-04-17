"use client"

import { formatDate } from "@/app/lib/utils"
import type { Database } from "@/app/types/supabase"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"

type Student = Database["public"]["Tables"]["students"]["Row"]

interface StudentDetailModalProps {
  student: Student | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (student: Student) => Promise<void>
  isUpdating: string | null
}

export function StudentDetailModal({
  student,
  open,
  onOpenChange,
  onStatusChange,
  isUpdating,
}: StudentDetailModalProps) {
  if (!student) return null

  const detailVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle>Detalhes do Aluno</DialogTitle>
          <DialogDescription className="dark:text-gray-400">Informações completas do cadastro</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AnimatePresence>
            <motion.div
              key="student-name"
              custom={0}
              initial="hidden"
              animate="visible"
              variants={detailVariants}
              className="flex flex-col gap-4"
            >
              <div className="font-medium dark:text-gray-300">Nome do Aluno:</div>
              <div className="col-span-3 border-b border-current pb-4">{student.name}</div>
            </motion.div>
            <motion.div
              key="guardian-name"
              custom={1}
              initial="hidden"
              animate="visible"
              variants={detailVariants}
              className="flex flex-col gap-4"
            >
              <div className="font-medium dark:text-gray-300">Nome do Responsável:</div>
              <div className="col-span-3 border-b border-current pb-4">{student.guardian_name}</div>
            </motion.div>
            <motion.div
              key="grade"
              custom={2}
              initial="hidden"
              animate="visible"
              variants={detailVariants}
              className="flex flex-col gap-4"
            >
              <div className="font-medium dark:text-gray-300">Série/Turma:</div>
              <div className="col-span-3 border-b border-current pb-4">{student.grade}</div>
            </motion.div>
            <motion.div
              key="status"
              custom={3}
              initial="hidden"
              animate="visible"
              variants={detailVariants}
              className="flex flex-col gap-4"
            >
              <div className="font-medium dark:text-gray-300">Status:</div>
              <div className="col-span-3 border-b border-current pb-4">
                <Badge variant={student.active ? "success" : "secondary"}>{student.active ? "Ativo" : "Inativo"}</Badge>
              </div>
            </motion.div>
            <motion.div
              key="student-whatsapp"
              custom={4}
              initial="hidden"
              animate="visible"
              variants={detailVariants}
              className="flex flex-col gap-4"
            >
              <div className="font-medium dark:text-gray-300">WhatsApp do Aluno:</div>
              <div className="col-span-3 border-b border-current pb-4">
                <a
                  href={`https://wa.me/${student.student_whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {student.student_whatsapp}
                </a>
              </div>
            </motion.div>
            <motion.div
              key="guardian-whatsapp"
              custom={5}
              initial="hidden"
              animate="visible"
              variants={detailVariants}
              className="flex flex-col gap-4"
            >
              <div className="font-medium dark:text-gray-300">WhatsApp do Responsável:</div>
              <div className="col-span-3 border-b border-current pb-4">
                <a
                  href={`https://wa.me/${student.guardian_whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {student.guardian_whatsapp}
                </a>
              </div>
            </motion.div>
            <motion.div
              key="created-at"
              custom={6}
              initial="hidden"
              animate="visible"
              variants={detailVariants}
              className="flex flex-col gap-4"
            >
              <div className="font-medium dark:text-gray-300">Data de Cadastro:</div>
              <div className="col-span-3">{formatDate(student.created_at)}</div>
            </motion.div>
          </AnimatePresence>
        </div>
        <DialogFooter>
          <motion.div
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
            className="w-full sm:w-auto"
          >
            <Button
              onClick={() => onStatusChange(student)}
              disabled={isUpdating === student.id}
              variant={student.active ? "destructive" : "default"}
              className="w-full gap-2"
            >
              {student.active ? (
                <>
                  <XCircle className="h-4 w-4" />
                  Desativar Aluno
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Ativar Aluno
                </>
              )}
              {isUpdating === student.id && (
                <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
