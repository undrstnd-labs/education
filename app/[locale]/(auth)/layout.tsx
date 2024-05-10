import { redirect } from "@navigation"

import { getCurrentUser, verifyCurrentUser } from "@/lib/session"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getCurrentUser()

  if (await verifyCurrentUser(user?.id as string)) {
    redirect("/dashboard")
  }

  return <div className="min-h-screen">{children}</div>
}
