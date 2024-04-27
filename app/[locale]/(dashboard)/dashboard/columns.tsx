"use client"

import { ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

import { Link } from "@/lib/navigation"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Icons } from "@/components/icons/Lucide"
import { ClassroomCardOptions } from "@/components/showcase/ClassroomCardOptions"

export type Classroom = {
  id: string
  classCode: string
  name: string
  isArchived: boolean
}

export const columns: ColumnDef<Classroom>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "classCode",
    header: () => {
      const t = useTranslations("Pages.TeacherDashboard")
      return (
        <div className="flex items-center justify-center">{t("classCode")}</div>
      )
    },
    cell: ({ row }) => {
      const classroom = row.original

      return (
        <div className="flex items-center justify-center ">
          {classroom.classCode}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      const t = useTranslations("Pages.TeacherDashboard")
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("name")}
            <Icons.ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const classroom = row.original

      return (
        <div className="flex items-center justify-center ">
          <Link href={`/dashboard/classroom/${classroom.id}`}>
            {classroom.name}
          </Link>
        </div>
      )
    },
  },
  {
    accessorKey: "isArchived",
    header: ({ column }) => {
      const t = useTranslations("Pages.TeacherDashboard")
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("status")}
            <Icons.ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const isArchived = row.getValue("isArchived")
      const t = useTranslations("Pages.TeacherDashboard")
      return (
        <div className="flex items-center justify-center">
          {isArchived ? (
            <Badge className="bg-red-500 hover:bg-red-400">
              {t("archived")}
            </Badge>
          ) : (
            <Badge>{t("unarchived")}</Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className=" text-center">Actions</div>,
    cell: ({ row }) => {
      const classroom = row.original

      return (
        <div className="flex items-center justify-center">
          <ClassroomCardOptions classroom={classroom as any} />
        </div>
      )
    },
  },
]
