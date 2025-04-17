import { ThemeToggle } from "@/app/components/theme-toggle"
import { Button } from "@/app/components/ui/button"
import { createServerSupabaseClient } from "@/lib/supabase"
import { UserButton } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs/server"
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import type React from "react"


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  const schoolId = user.publicMetadata.schoolId as string | undefined

  if (!schoolId) {
    redirect("/new-school")
  }

  const supabase = createServerSupabaseClient()
  const { data: school } = await supabase
    .from("schools")
    .select("name, logo_url")
    .eq("id", schoolId)
    .single()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background flex justify-center">
        <div className="container flex h-16 items-center justify-between py-4 px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-sky-600" />
              <span className="font-semibold text-sky-700">TutorDigital</span>
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            {school?.logo_url && (
              <img
                src={school.logo_url || "/placeholder.svg"}
                alt={school.name}
                className="h-8 w-8 rounded-full object-contain"
              />
            )}
            <h1 className="text-xl font-semibold">{school?.name || "Painel Administrativo"}</h1>
          </div>
          <div className="flex items-center gap-2">
              <Link href="/dashboard/blog">
                <Button variant="ghost" size="sm">
                  Blog
                </Button>
              </Link>
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
        </div>
      </header>
      <main className="flex-1 flex justify-center max-sm:px-4">{children}</main>
    </div>
  )
}
