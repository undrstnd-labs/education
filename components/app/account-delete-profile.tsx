"use client"

import React, { useState } from "react"
import { useRouter } from "@navigation"
import { User } from "@prisma/client"
import { signOut } from "next-auth/react"
import { useTranslations } from "next-intl"

import { ResponsiveAlertDialog } from "@/components/shared/responsive-alert-dialog"
import { Button } from "@/components/ui/button"

import { deleteAccount } from "@/undrstnd/user"

export function AccountDeleteProfile({ user }: { user: User }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const t = useTranslations("app.components.app.account-delete-profile")

  const handleDelete = async () => {
    setLoading(true)
    signOut()

    const deletedUSer = await deleteAccount(user)

    if (deletedUSer) {
      router.push("/register")
    }

    setLoading(false)
  }

  return (
    <div>
      <Button
        onClick={() => setIsDeleteOpen(true)}
        variant="destructive"
        className="w-full"
      >
        Delete Profile
      </Button>
      <ResponsiveAlertDialog
        title={t("title-dialog")}
        description={t("description-dialog")}
        cancelText={t("cancel")}
        confirmText={t("delete")}
        loading={loading}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        action={handleDelete}
      />
    </div>
  )
}
