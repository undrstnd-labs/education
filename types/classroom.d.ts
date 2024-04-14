import { Classroom, User } from "@prisma/client";
export type classroom = Classroom & {
  teacher: { user: User; id: string; userId: string };
};
