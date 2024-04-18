"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { toast } from "@hook/use-toast";
import { useRouter } from "@lib/navigation";

interface JoinClassroomProps {
  classCode: string;
  userId: string;
}

export function JoinClassroom({ classCode, userId }: JoinClassroomProps) {
  const router = useRouter();
  const t = useTranslations("Pages.Classroom");
  const [open, setOpen] = useState(true);

  const handleJoin = async () => {
    try {
      const res = await fetch(`/api/classrooms/join/${classCode}`, {
        method: "PATCH",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        toast({
          title: t("joinApiSuccess"),
          variant: "default",
          description: t("joinApiSuccessDescription"),
        });
        router.refresh();
      } else {
        const data = await res.json();
        if (data.messageNotFound) {
          toast({
            title: t("joinApiError"),
            variant: "destructive",
            description: t("joinApiErrorDescription"),
          });
        }
        if (data.messageArchived) {
          toast({
            title: t("joinApiErrorArchived"),
            variant: "destructive",
            description: t("joinApiErrorArchivedDescription"),
          });
        }
        if (data.messageAlreadyJoin) {
          toast({
            title: t("joinApiAlreadyError"),
            variant: "destructive",
            description: t("joinApiAlreadyErrorDescription"),
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/dashboard/classroom");
    }
  };

  if (open) {
    useEffect(() => {
      handleJoin();
    }, []);

    return (
      <>
        <span className="sr-only">
          Doing this because hydration error make me fool
        </span>
      </>
    );
  }
  return <></>;
}
