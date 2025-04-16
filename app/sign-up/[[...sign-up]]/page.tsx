import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-sky-600 hover:bg-sky-700",
            footerActionLink: "text-sky-600 hover:text-sky-700",
          },
        }}
      />
    </div>
  )
}
