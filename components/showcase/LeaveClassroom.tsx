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
import { Icons } from "../icons/Lucide";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";

interface LeaveClassroomProps {
  classroom: Classroom;
  userId: string;
}

export function LeaveClassroom({ classroom, userId }: LeaveClassroomProps) {
  const router = useRouter();
  const t = useTranslations("Components.Display.ClassroomCardOptions");
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleLeave = async () => {
    const res = await fetch(`/api/classrooms/leave/${classroom.classCode}`, {
      method: "PATCH",
      body: JSON.stringify({ userId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      toast({
        title: t("leaveApiSuccess"),
        variant: "default",
        description: t("leaveApiSuccessDescription"),
      });
      router.refresh();
    }
  };
  return (
    <>
      {isDesktop ? (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
            <Button
              variant="outline"
              size={"icon"}
              className="h-8 w-8 max-sm:h-6 max-sm:w-6"
            >
              <Icons.leaveClassroom className="h-4 w-4 text-red-500 " />
              <span className="sr-only">Leave classroom</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("alertDialogLeave")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("alertDialogLeaveDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("alertDialogCancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLeave}
                className="bg-red-700 hover:bg-red-500"
              >
                {t("alertDialogAction")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild onClick={() => setOpen(true)}>
            <Button
              variant="outline"
              size={"icon"}
              className="h-8 w-8 max-sm:h-6 max-sm:w-6"
            >
              <Icons.leaveClassroom className="h-4 w-4 text-red-500 " />
              <span className="sr-only">Leave classroom</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="pb-2">
            <DrawerHeader className="text-left">
              <DrawerTitle>{t("alertDialogLeave")}</DrawerTitle>
              <DrawerDescription>
                {t("alertDialogLeaveDescription")}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="bg-red-700 hover:bg-red-500 text-white"
                  onClick={handleLeave}
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
    </>
  );
}