import Image from "next/image"
import { Link } from "@navigation"
import { Classroom, User } from "@prisma/client"
import { getTranslations } from "next-intl/server"

import { Icons } from "@/components/shared/icons"
import { ClassroomCardOptions } from "@/components/showcase/ClassroomCardOptions"
import { LeaveClassroom } from "@/components/showcase/LeaveClassroom"
import { ShareClassroom } from "@/components/showcase/ShareClassroom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CopyText } from "@/components/ui/copy-text"

interface classroomCardProps {
  authorId: string
  classroom: Classroom & {
    teacher: { user: User; id: string; userId: string }
  }
}

export async function FeedClassroomCard({
  classroom,
  authorId,
}: classroomCardProps) {
  const t = await getTranslations("app.components.app.feed-classroom-card")
  return (
    <Card className="flex flex-col gap-4 p-4 transition-all duration-150 hover:bg-accent/30 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">{classroom.name}</h3>
            {classroom.isArchived && classroom.teacher.userId === authorId ? (
              <Badge variant={"secondary"}>{t("archived")}</Badge>
            ) : (
              <CopyText text={classroom.classCode} />
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {classroom.description}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {!classroom.isArchived && (
            <Link href={`/classroom/${classroom.id}`} key={classroom.id}>
              <Button
                variant="outline"
                size={"icon"}
                className="size-8 max-sm:size-6"
              >
                <Icons.external className="size-4" />

                <span className="sr-only">Open classroom</span>
              </Button>
            </Link>
          )}
          <ShareClassroom classroom={classroom} />
          {authorId === classroom.teacher.user.id ? (
            <ClassroomCardOptions classroom={classroom} />
          ) : (
            <LeaveClassroom classroom={classroom} userId={authorId} />
          )}
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Image
          className="mt-1 size-7 rounded-full "
          src={classroom.teacher.user.image!}
          width={64}
          height={64}
          alt={classroom.teacher.user.name!}
        />
        <div className=" leading-[18px]">
          <div className="font-bold">{classroom.teacher.user.name}</div>
          <div className="text-sm text-muted-foreground">
            {classroom.teacher.user.email}
          </div>
        </div>
      </div>
    </Card>
  )
}
