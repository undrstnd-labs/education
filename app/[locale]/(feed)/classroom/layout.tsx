import { getTranslations } from "next-intl/server"

export async function generateMetadata() {
  const t = await getTranslations("app.pages.classroom")
  return { title: `${t("title")}` }
}

interface ClassroomLayoutProps {
  children: React.ReactNode
}

export default function ClassroomLayout({ children }: ClassroomLayoutProps) {
  return (
    <main className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </main>
  )
}
