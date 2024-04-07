"use client";

import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/icons/Lucide";
import { Classroom, User } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { EditClassroom } from "../form/EditClassroom";
import { toast } from "@/hooks/use-toast";
interface ClassroomCardProps {
  classroom: Classroom & {
    teacher: { user: User; id: string; userId: string };
  };
}

const ClassroomCardOptions = ({ classroom }: ClassroomCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("Components.Display.ClassroomCardOptions");
  const handleArchive = async () => {
    const res = await fetch(`/api/classrooms/${classroom.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: classroom.teacher.user.id,
        isArchived: true,
      }),
    });
    if (res.ok) {
      toast({
        title: t("toastTitleArchiveClassroom"),
        variant: "default",
        description: t("toastDescriptionArchiveClassroom"),
      });
      router.refresh();
    }
    try {
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async () => {
    const res = await fetch(`/api/classrooms/${classroom.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: classroom.teacher.user.id,
      }),
    });
    if (res.ok) {
      toast({
        title: t("toastTitleDeleteClassroom"),
        variant: "default",
        description: t("toastDescriptionDeleteClassroom"),
      });
      router.refresh();
    }
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Icons.moreHorizontal className="h-4 w-4" />
            <span className="sr-only">Toggle options of classroom</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("classroomOption")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-2 items-center hover:cursor-pointer"
            onClick={() => setIsModifyOpen(true)}
          >
            {t("editClassroom")}{" "}
            <Icons.editClassroom className="h-4 w-4 text-gray-600 " />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2 items-center hover:cursor-pointer"
            onClick={() => setIsArchiveOpen(true)}
          >
            {t("archiveClassroom")}
            <Icons.archiveClassroom className="h-4 w-4 text-blue-600" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2 items-center hover:cursor-pointer"
            onClick={() => setIsDeleteOpen(true)}
          >
            {t("deleteClassroom")}
            <Icons.deleteClassroom className="h-4 w-4 text-red-600 " />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isArchiveOpen && (
        <AlertDialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("alertDialogTitleArchive")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("alertDialogDescriptionArchive")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("alertDialogCancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleArchive}>
                {t("alertDialogAction")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {isDeleteOpen && (
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("alertDialogTitleDelete")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("alertDialogDescriptionDelete")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="focus-visible:ring-red-700">
                {t("alertDialogCancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-700 hover:bg-red-500"
                onClick={handleDelete}
              >
                {t("alertDialogAction")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {isModifyOpen && (
        <EditClassroom
          classroom={classroom}
          open={isModifyOpen}
          setOpen={setIsModifyOpen}
        />
      )}
    </>
  );
};

export default ClassroomCardOptions;
