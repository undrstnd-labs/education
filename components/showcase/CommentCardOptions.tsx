"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { toast } from "@hook/use-toast";
import { useMediaQuery } from "@hook/use-media-query";

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
} from "@component/ui/AlertDialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@component/ui/Drawer";
import { Button } from "@component/ui/Button";
import { Icons } from "@component/icons/Lucide";

import { comment } from "@/types/classroom";
import EditComment from "../form/EditComment";
interface CommentCardOptionsProps {
  postId: string;
  userId: string;
  comment: comment;
}

const CommentCardOptions = ({
  comment,
  postId,
  userId,
}: CommentCardOptionsProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const t = useTranslations("Components.Display.CommentCardOptions");
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/comments/${postId}/${comment.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        toast({
          title: t("toastTitleDeleteComment"),
          variant: "default",
          description: t("toastDescriptionDeleteComment"),
        });
        router.refresh();
      } else {
        toast({
          title: t("toastTitleDeleteCommentError"),
          variant: "destructive",
          description: t("toastDescriptionDeleteCommentError"),
        });
      }
    } catch (error) {
      toast({
        title: "Error deleting comment",
        variant: "destructive",
        description: "An error occurred while deleting the comment",
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
            <span className="sr-only">Toggle options of comment</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("commentOption")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => setIsModifyOpen(true)}
          >
            <Icons.editClassroom className="h-4 w-4 " />
            {t("editComment")}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 text-red-600 hover:cursor-pointer"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Icons.deleteClassroom className="h-4 w-4 " />
            {t("deleteComment")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
                  className="bg-red-700 text-white hover:bg-red-500"
                  onClick={handleDelete}
                >
                  {t("alertDialogCancel")}
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="outline"> {t("alertDialogAction")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      {isModifyOpen && (
        <EditComment
          comment={comment}
          postId={postId}
          userId={userId}
          open={isModifyOpen}
          setOpen={setIsModifyOpen}
        />
      )}
    </>
  );
};

export default CommentCardOptions;
