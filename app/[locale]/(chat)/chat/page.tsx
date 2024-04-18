import { Student, User } from "@prisma/client";

import { getCurrentUser, getCurrentStudent } from "@lib/session";
import { generateUuid } from "@lib/utils";

import { Chat } from "@component/display/Chat";

export default async function IndexPage() {
  const id = generateUuid();
  const user = await getCurrentUser();

  const student = (await getCurrentStudent(user!.id)) as Student & {
    user: User;
  };

  return <Chat id={id} student={student} />;
}
