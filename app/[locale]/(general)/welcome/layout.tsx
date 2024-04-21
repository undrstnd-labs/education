export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-hero-pattern -mt-20 bg-neutral-100 bg-cover bg-top bg-no-repeat pb-20 antialiased">
      {children}
    </div>
  )
}
