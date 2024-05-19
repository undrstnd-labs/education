import React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface ResponsiveDialogProps {
  title: string
  description: string
  loading: boolean
  children: React.ReactNode
  open: boolean
  setOpen: (open: boolean) => void
  action: () => void
}

function DialogComponent(props: ResponsiveDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full max-w-sm">{props.title}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{props.description}</DialogDescription>
        {props.children}
      </DialogContent>
    </Dialog>
  )
}

function DrawerComponent(props: ResponsiveDialogProps) {
  return (
    <Drawer open={props.open} onOpenChange={props.setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full max-w-sm">{props.title}</Button>
      </DrawerTrigger>
      <DrawerContent className="h-full px-2">
        <DrawerHeader>
          <DrawerTitle>{props.title}</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription>{props.description}</DrawerDescription>
        {props.children}
      </DrawerContent>
    </Drawer>
  )
}

export function ResponsiveDialog(props: ResponsiveDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return <DialogComponent {...props} />
  }

  return <DrawerComponent {...props} />
}
