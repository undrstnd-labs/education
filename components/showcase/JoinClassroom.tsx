"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Classroom } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useEffect, useState } from "react";

interface JoinClassroomProps {
  classCode: string;
  userId: string;
}

export function JoinClassroom({ classCode, userId }: JoinClassroomProps) {
  const router = useRouter();
  const t = useTranslations("Pages.Classroom");
  const [open, setOpen] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
