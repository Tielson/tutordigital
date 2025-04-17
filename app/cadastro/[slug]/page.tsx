import StudentRegistrationForm from "@/app/components/student-registration-form"
import { createServerSupabaseClient } from "@/lib/supabase"
import { notFound } from "next/navigation"

interface CadastroPageProps {
  params: {
    slug?: string
  }
}

export default async function CadastroPage({ params }: CadastroPageProps) {
  if (!params || !params.slug) {
    console.error("Parâmetros inválidos ou ausentes:", params)
    notFound()
  }

  const { slug } = params

  // Log para depuração
  console.log("Fetching school with slug:", slug)

  // Get school information from slug
  const supabase = createServerSupabaseClient()
  const { data: school, error } = await supabase
    .from("schools")
    .select("*")
    .eq("slug", slug)
    .single()

  // Log de erro
  if (error) {
    console.error("Error fetching school:", error)
    notFound()
  }

  if (!school) {
    console.error("School not found for slug:", slug)
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col items-center justify-center gap-4 text-center md:mb-12">
          <div className="relative h-24 w-24 md:h-32 md:w-32">
            {school.logo_url ? (
              <img
                src={school.logo_url || "/placeholder.svg"}
                alt={school.name}
                className="h-full w-full rounded-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-12 w-12 md:h-16 md:w-16"
                >
                  <path d="m2 22 10-10" />
                  <path d="m16 8-4 4" />
                  <path d="M2 12h4" />
                  <path d="M2 2h10v10" />
                  <path d="M12 2h10v10" />
                  <path d="M14 14h8v8" />
                  <path d="M8 22V8" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Cadastro de Alunos</h1>
            <p className="mt-2 text-xl text-muted-foreground">{school.name}</p>
            <p className="mt-2 text-muted-foreground md:text-lg">
              Preencha o formulário abaixo para realizar o cadastro do aluno
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm md:p-8">
          <StudentRegistrationForm schoolId={school.id} />
        </div>
      </div>
    </div>
  </main>
  )
}