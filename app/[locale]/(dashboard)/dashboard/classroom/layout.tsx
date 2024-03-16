interface ClassroomLayoutProps {
  children: React.ReactNode;
}

export default function ClassroomLayout({ children }: ClassroomLayoutProps) {
  return <div className="min-h-screen">{children}</div>;
}
