"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Classroom, User } from "@prisma/client";
import { toast } from "@hook/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@component/ui/DropdownMenu";
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
import { Button } from "@component/ui/Button";
import { Icons } from "@component/icons/Lucide";
import { EditClassroom } from "@component/form/EditClassroom";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ClassroomCardProps {
  classroom: Classroom & {
    teacher: { user: User; id: string; userId: string };
  };
}

export function ClassroomCardOptions({ classroom }: ClassroomCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const t = useTranslations("Components.Display.ClassroomCardOptions");

  const handleArchive = async () => {
    try {
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
          description: t("toastDescriptionArchiveClassroom"),
        });
        router.refresh();
      }
    } catch (error) {
      toast({
        title: t("error-toast-archive"),
        description: t("error-description-toast-archive"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
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
    } catch (error) {
      toast({
        title: t("error-toast-delete"),
        description: t("error-description-toast-arcdeletehive"),
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 max-sm:h-6 max-sm:w-6"
          >
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
            <Icons.editClassroom className="h-4 w-4 " />
            {t("editClassroom")}{" "}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2 items-center hover:cursor-pointer"
            onClick={() => setIsArchiveOpen(true)}
          >
            <Icons.archiveClassroom className="h-4 w-4" />
            {t("archiveClassroom")}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-2 items-center hover:cursor-pointer text-red-600"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Icons.deleteClassroom className="h-4 w-4 " />
            {t("deleteClassroom")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isArchiveOpen && isDesktop ? (
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
      ) : (
        <Drawer open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
          <DrawerContent className="pb-2">
            <DrawerHeader className="text-left">
              <DrawerTitle> {t("alertDialogTitleArchive")}</DrawerTitle>
              <DrawerDescription>
                {t("alertDialogDescriptionArchive")}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="default" onClick={handleArchive}>
                  {t("alertDialogAction")}
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline">{t("alertDialogCancel")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      {isDeleteOpen && isDesktop ? (
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("alertDialogTitleDelete")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("alertDialogDescriptionDelete")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("alertDialogCancel")}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-700 hover:bg-red-500"
                onClick={handleDelete}
              >
                {t("alertDialogAction")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Drawer open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DrawerContent className="pb-2">
            <DrawerHeader className="text-left">
              <DrawerTitle>{t("alertDialogTitleDelete")}</DrawerTitle>
              <DrawerDescription>
                {t("alertDialogDescriptionDelete")}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="bg-red-700 hover:bg-red-500 text-white"
                  onClick={handleDelete}
                >
                  {t("alertDialogAction")}
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline">{t("alertDialogCancel")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
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
}
