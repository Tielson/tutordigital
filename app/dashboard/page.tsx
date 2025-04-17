import { createServerSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import DashboardClient from "./_components/dashboard-client"

type Student = Database["public"]["Tables"]["students"]["Row"]
type School = Database["public"]["Tables"]["schools"]["Row"]
type UserPublicMetadata = {
  schoolId?: string
}

export default async function DashboardPage({ searchParams }: { searchParams: { q?: string } }) {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect("/sign-in")
  }

  const schoolId = user.publicMetadata.schoolId as string | undefined

  if (!schoolId) {
    redirect("/new-school")
  }

  const supabase = createServerSupabaseClient()

  const { data: schoolData, error: schoolError } = await supabase
    .from("schools")
    .select("*")
    .eq("id", schoolId)
    .single()

  if (schoolError || !schoolData) {
    redirect("/new-school")
  }

  const registrationLink = `${process.env.NEXT_PUBLIC_APP_URL}/cadastro/${schoolData.slug}`

  // Certifique-se de que searchParams seja tratado corretamente
  const searchQuery = (await searchParams)?.q ?? ""

  return (
    <DashboardClient
      school={schoolData}
      search={searchQuery}
      registrationLink={registrationLink}
    />
  )
}