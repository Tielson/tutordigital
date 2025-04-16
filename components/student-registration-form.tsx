"use client"

import { createClientSupabaseClient } from "@/lib/supabase"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  guardianName: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  grade: z.string({
    required_error: "Por favor selecione a série/turma.",
  }),
  studentWhatsapp: z.string().min(11, {
    message: "O número deve ter pelo menos 11 dígitos.",
  }),
  guardianWhatsapp: z.string().min(11, {
    message: "O número deve ter pelo menos 11 dígitos.",
  }),
})

interface StudentRegistrationFormProps {
  schoolId: string
}

export default function StudentRegistrationForm({ schoolId }: StudentRegistrationFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      guardianName: "",
      studentWhatsapp: "",
      guardianWhatsapp: "",
    },
  })

  // Atualizar a função onSubmit para incluir o nome do responsável
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const supabase = createClientSupabaseClient()

      // Insert student data with active set to false
      const { error } = await supabase.from("students").insert({
        school_id: schoolId,
        name: values.name,
        guardian_name: values.guardianName,
        grade: values.grade,
        student_whatsapp: values.studentWhatsapp,
        guardian_whatsapp: values.guardianWhatsapp,
        active: false, // Aluno começa como inativo
      })

      if (error) throw error

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Os dados do aluno foram registrados.",
      })

      form.reset()
      setIsSuccess(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao cadastrar o aluno. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-8 text-center"
      >
        <div className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
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
            className="h-6 w-6"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold dark:text-white">Cadastro Realizado com Sucesso!</h3>
        <p className="mb-4 text-muted-foreground dark:text-gray-300">
          Obrigado por se cadastrar. Seus dados foram registrados com sucesso.
        </p>
        <p className="mb-4 text-muted-foreground dark:text-gray-300">
          Seu cadastro será ativado após a confirmação da escola.
        </p>
        <Button onClick={() => setIsSuccess(false)}>Cadastrar outro aluno</Button>
      </motion.div>
    )
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-gray-200">Nome do aluno</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome completo do aluno"
                    {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guardianName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do responsável</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo do responsável" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Série/Turma</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a série/turma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1-ef">1º Ano - Ensino Fundamental</SelectItem>
                    <SelectItem value="2-ef">2º Ano - Ensino Fundamental</SelectItem>
                    <SelectItem value="3-ef">3º Ano - Ensino Fundamental</SelectItem>
                    <SelectItem value="4-ef">4º Ano - Ensino Fundamental</SelectItem>
                    <SelectItem value="5-ef">5º Ano - Ensino Fundamental</SelectItem>
                    <SelectItem value="6-ef">6º Ano - Ensino Fundamental</SelectItem>
                    <SelectItem value="7-ef">7º Ano - Ensino Fundamental</SelectItem>
                    <SelectItem value="8-ef">8º Ano - Ensino Fundamental</SelectItem>
                    <SelectItem value="9-ef">9º Ano - Ensino Fundamental</SelectItem>
                    <SelectItem value="1-em">1º Ano - Ensino Médio</SelectItem>
                    <SelectItem value="2-em">2º Ano - Ensino Médio</SelectItem>
                    <SelectItem value="3-em">3º Ano - Ensino Médio</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="dark:text-gray-400">
                  Selecione a série e o nível de ensino do aluno.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="studentWhatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp do Aluno</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guardianWhatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp do Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </motion.div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Cadastrar Aluno"}
        </Button>
      </motion.form>
    </Form>
  )
}
