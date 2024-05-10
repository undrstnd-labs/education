import { Student, Teacher, User } from "@prisma/client"
import { getTranslations } from "next-intl/server"

import { classroom } from "@/types/classroom"

import { redirect } from "@/lib/navigation"
import { getCurrentEntity, getCurrentUser } from "@/lib/session"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Dashboard")
  return { title: `${t("title")}` }
}

async function getClassrooms(user: User) {
  const entity = (await getCurrentEntity(user)) as Student | Teacher
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/classrooms/${user.role.toLowerCase()}/${entity.id}`,
      {
        method: "GET",
        next: {
          revalidate: 0,
        },
      }
    )

    if (res.ok) {
      const data: classroom[] = await res.json()
      return data
    }
    return null
  } catch (error) {
    console.log(error)
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const classrooms = await getClassrooms(user!)

  if (user?.role === "TEACHER") {
    const t = await getTranslations("Pages.TeacherDashboard")
    return (
      <div className="container mx-auto py-10">
        <div className="mb-10 text-center text-xl font-bold md:text-3xl">
          {t("title")}
        </div>
        <DataTable columns={columns} data={classrooms as any} />
      </div>
    )
  } else return <div>Student Dashboard</div>
}
