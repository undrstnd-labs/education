import React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"

import { Icons } from "@/components/shared/icons"
import {
  AlertDialog,
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

interface ResponsiveAlertDialogProps {
  title: string
  description: string
  cancelText: string
  confirmText: string
  loading: boolean
  open: boolean
  setOpen: (open: boolean) => void
  action: () => void
}

function AlertDialogComponent(props: ResponsiveAlertDialogProps) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>{props.description}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={props.loading}>
            {props.cancelText}
          </AlertDialogCancel>
          <Button disabled={props.loading} onClick={props.action}>
            {props.loading && (
              <Icons.loader className="mr-2 h-5 w-5 animate-spin" />
            )}
            {props.confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DrawerComponent(props: ResponsiveAlertDialogProps) {
  return (
    <Drawer open={props.open} onOpenChange={props.setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{props.title}</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription>{props.description}</DrawerDescription>
        <DrawerFooter>
          <Button disabled={props.loading} onClick={props.action}>
            {props.loading && (
              <Icons.loader className="mr-2 h-5 w-5 animate-spin" />
            )}

            {props.confirmText}
          </Button>
          <DrawerClose disabled={props.loading}>{props.cancelText}</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export function ResponsiveAlertDialog(props: ResponsiveAlertDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return <AlertDialogComponent {...props} />
  }

  return <DrawerComponent {...props} />
}
