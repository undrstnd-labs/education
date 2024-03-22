import { getCurrentUser } from "@lib/session";
import { redirect } from "@lib/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
    return null;
  }

  if (user.role === "NOT_ASSIGNED") {
    redirect("/onboarding");
    return null;
  }

  return <div className="min-h-screen">{children}</div>;
}
