"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { Classroom, Post } from "@/types/classroom"

import { deleteFiles } from "@/lib/storage"
import { useMediaQuery } from "@/hooks/use-media-query"
import { toast } from "@/hooks/use-toast"

import { Icons } from "@/components/shared/icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import EditPost from "../form/EditPost"

interface PostCardOptionsProps {
  post: Post
  userId: string
  classroom: Classroom
}

const PostCardOptions = ({ classroom, post, userId }: PostCardOptionsProps) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isModifyOpen, setIsModifyOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const t = useTranslations("Components.Display.PostCardOptions")
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/posts/${classroom.id}/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      post.files &&
        post.files.length > 0 &&
        (await deleteFiles(post.files.map((file) => file.url)))

      if (res.ok) {
        toast({
          title: t("toastTitleDeletePost"),
          variant: "default",
          description: t("toastDescriptionDeletePost"),
        })
        router.refresh()
      } else {
        toast({
          title: t("toastTitleDeletePostError"),
          variant: "destructive",
          description: t("toastDescriptionDeletePostError"),
        })
      }
    } catch (error) {
      toast({
        title: t("toastTitleDeletePostError"),
        variant: "destructive",
        description: t("toastDescriptionDeletePostError"),
      })
    }
  }

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
            <span className="sr-only">Toggle options of post</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("postOption")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 hover:cursor-pointer"
            onClick={() => setIsModifyOpen(true)}
          >
            <Icons.editClassroom className="h-4 w-4 " />
            {t("editPost")}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2 text-red-600 hover:cursor-pointer"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Icons.deleteClassroom className="h-4 w-4 " />
            {t("deletePost")}
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
        <EditPost
          classroom={classroom}
          open={isModifyOpen}
          setOpen={setIsModifyOpen}
          userId={userId}
          post={post}
        />
      )}
    </>
  )
}

export default PostCardOptions
