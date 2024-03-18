interface AuthLayoutProps {
  children: React.ReactNode;
}

//TODO: If the user is authenticated, redirect to the explore page

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <div className="min-h-screen">{children}</div>;
}
