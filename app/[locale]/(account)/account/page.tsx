import { unstable_setRequestLocale } from "next-intl/server"

import { redirect } from "@/lib/navigation"
import { getCurrentUser } from "@/lib/session"

import Profile from "@/components/form/Profile"

export default async function AccountPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)

  const userSession = await getCurrentUser()

  if (!userSession) {
    redirect("/login")
  }

  return (
    <div className="flex h-full items-center justify-center sm:items-start sm:pt-[120px]">
      <Profile
        name={userSession?.name!}
        bio={userSession?.bio!}
        image={userSession?.image!}
        id={userSession?.id!}
      />
    </div>
  )
}
