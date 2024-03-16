export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased bg-top -mt-20 pb-20 bg-no-repeat bg-cover bg-neutral-100 bg-hero-pattern">
      {children}
    </div>
  );
}
