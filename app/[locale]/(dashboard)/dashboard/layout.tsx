interface DashboardLayoutProps {
  children: React.ReactNode;
}

// TODO: If the user is not authenticated, redirect to the login page

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <div className="min-h-screen">{children}</div>;
}
