// TODO: Generate metadata for this page

import { redirect } from "@lib/navigation";
import { getCurrentUser, getCurrentEntity } from "@/lib/session";
import { User, Student, Teacher } from "@prisma/client";

import { NextAuthUser } from "@/types/auth";
import { classroom } from "@/types/classroom";
import { userAuthentificateVerification } from "@/lib/session";

import PostCard from "@/components/display/PostCard";
import { PostAddCard } from "@component/form/PostAddCard";
import { ClassroomCard } from "@component/display/ClassroomCard";

async function getClassroom(user: User, classroomId: string) {
  const entity = (await getCurrentEntity(user)) as Student | Teacher;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/classrooms/${classroomId}/${user.role.toLowerCase()}/${entity.id}`,
      {
        method: "GET",
        next: {
          revalidate: 0,
        },
      }
    );

    if (res.ok) {
      const data: classroom = await res.json();
      return data;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
}

export default async function ClassroomPage({
  params: { classroomId },
}: {
  params: { classroomId: string };
}) {
  const user = await getCurrentUser();
  const toRedirect = await userAuthentificateVerification(user as NextAuthUser);

  if (toRedirect) {
    redirect(toRedirect);
  }

  if (!user) {
    return null;
  }

  const classroom = await getClassroom(user, classroomId);

  if (!classroom) {
    return redirect("/dashboard/classroom");
  }

  return (
    <div className="flex flex-col gap-4">
      <ClassroomCard authorId={user.id} classroom={classroom} />
      {user.role === "TEACHER" && (
        <PostAddCard userId={user.id} classroom={classroom} />
      )}
      <div className="flex flex-col gap-6">
        {classroom.posts && classroom.posts.length > 0 ? (
          classroom.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              userId={user.id}
              classroom={classroom}
              role={user.role}
            />
          ))
        ) : (
          <h1 className="font-bold md:text-xl">
            {user?.role === "TEACHER"
              ? "No posts. Create one now"
              : "No posts to show. Wait for the teacher to post something."}
          </h1>
        )}
      </div>
    </div>
  );
}
