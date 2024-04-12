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

interface classroomCardProps {
  classroom: Classroom & {
    teacher: { user: User; id: string; userId: string };
  };
}

export function ClassroomCard({ classroom }: classroomCardProps) {
  return (
    <Card className="w-full" key={classroom.id}>
      <CardHeader>
        <CardTitle className="hover:underline">
          <div className="flex justify-between">
            <Link
              href={`/dashboard/classroom/${classroom.id}`}
              key={classroom.id}
            >
              {classroom.name}
            </Link>
            <ClassroomCardOptions classroom={classroom as any} />
          </div>
        </CardTitle>
        <CardDescription className="hover:underline">
          <Link
            href={`/dashboard/classroom/${classroom.id}`}
            key={classroom.id}
          >
            {classroom.description}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full -mt-5">
        <Link href={`/dashboard/classroom/${classroom.id}`} key={classroom.id}>
          <div className="flex gap-2 items-start">
            <Image
              className="w-7 h-7 rounded-full  mt-1 "
              src={classroom.teacher?.user.image!}
              width={16}
              height={16}
              alt={classroom.teacher?.user.name!}
            />
            <div className=" leading-[18px]">
              <div className="font-bold hover:underline">
                {classroom.teacher?.user.name}
              </div>
              <div className="text-muted-foreground hover:underline text-sm">
                {classroom.teacher?.user.email}
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
