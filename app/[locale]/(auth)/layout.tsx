import { redirect } from "@lib/navigation";
import { getCurrentUser } from "@lib/session";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getCurrentUser();

  if (user && user.role !== "NOT_ASSIGNED") {
    redirect("/dashboard");
  }

  return <div className="min-h-screen">{children}</div>;
}
