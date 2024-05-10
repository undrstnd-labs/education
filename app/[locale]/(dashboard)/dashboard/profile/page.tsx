import { redirect } from "@/lib/navigation"
import { db } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/session"

import Profile from "@/components/form/Profile"

const ProfilePage = async () => {
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

export default ProfilePage
