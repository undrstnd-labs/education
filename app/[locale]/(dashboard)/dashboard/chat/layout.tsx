interface ChatLayoutProps {
  children: React.ReactNode;
}

// TODO: If the user is not authenticated, redirect to the login page

export default function ChatLayout({ children }: ChatLayoutProps) {
  return <div className="min-h-screen">{children}</div>;
}
