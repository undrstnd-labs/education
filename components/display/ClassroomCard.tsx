import Link from "next/link";
import Image from "next/image";
import { Classroom, User } from "@prisma/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@component/ui/Card";
import { ClassroomCardOptions } from "@/components/showcase/ClassroomCardOptions";

import { LeaveClassroom } from "@/components/showcase/LeaveClassroom";
import ShareClassroom from "@/components/showcase/ShareClassroom";

interface classroomCardProps {
  classroom: Classroom & {
    teacher: { user: User; id: string; userId: string };
  };
  authorId: string;
}

export const ClassroomCard = ({ classroom, authorId }: classroomCardProps) => {
  return (
    <Card className="w-full transition-all hover:bg-accent" key={classroom.id}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <Link
              href={`/dashboard/classroom/${classroom.id}`}
              key={classroom.id}
              className=" flex flex-1 items-center"
            >
              <div className="hover:underline">{classroom.name}</div>
              <span className="text-gray-600">/</span>
              <div className="text-sm leading-8 text-gray-500">
                {classroom.classCode}
              </div>
            </Link>
            <div className="flex gap-2">
              <ShareClassroom classroom={classroom} />
              {authorId === classroom.teacher.user.id ? (
                <ClassroomCardOptions classroom={classroom} />
              ) : (
                <LeaveClassroom classroom={classroom} userId={authorId} />
              )}
            </div>
          </div>
        </CardTitle>
        <Link href={`/dashboard/classroom/${classroom.id}`} key={classroom.id}>
          <CardDescription className="hover:underline">
            {classroom.description}
          </CardDescription>
        </Link>
      </CardHeader>
      <CardContent className="-mt-5 w-full">
        <Link href={`/dashboard/classroom/${classroom.id}`} key={classroom.id}>
          <div className="flex items-start gap-2">
            <Image
              className="mt-1 h-7 w-7  rounded-full "
              src={classroom.teacher?.user.image!}
              width={16}
              height={16}
              alt={classroom.teacher?.user.name!}
            />
            <div className=" leading-[18px]">
              <div className="font-bold hover:underline">
                {classroom.teacher?.user.name}
              </div>
              <div className="text-sm text-muted-foreground hover:underline">
                {classroom.teacher?.user.email}
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
