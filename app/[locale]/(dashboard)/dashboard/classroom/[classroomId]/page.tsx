// TODO: Generate metadata for this page

import { ClassroomCard } from "@/components/display/ClassroomCard";
import PostCard from "@/components/display/PostCard";
import PostAddCard from "@/components/showcase/PostAddCard";
import { redirect } from "@/lib/navigation";
import { getCurrentUser, userAuthentificateVerification } from "@/lib/session";
import { NextAuthUser } from "@/types/auth";
import { classroom } from "@/types/classroom";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getCookie(name: string) {
  return cookies().get(name)?.value ?? "";
}
const getClassroom = async (classroomId: string) => {
  const session = await getCookie("next-auth.session-token");
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/classrooms/${classroomId}`,
      {
        cache: "no-store",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `next-auth.session-tokend=${session}`,
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
};

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
  const classroom = await getClassroom(classroomId);

  if (!classroom) {
    return notFound();
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
            <PostCard key={post.id} post={post} userId={user.id} />
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
