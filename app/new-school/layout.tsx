import { UserButton } from "@clerk/nextjs"

export default async function NewSchoolLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b p-4 flex items-center justify-between bg-white">
        <div className="text-lg font-medium text-muted-foreground dark:text-gray-400">Sistema de Cadastro</div>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 