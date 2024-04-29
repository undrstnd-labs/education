"use client"

import * as React from "react"
import { NextIntlClientProvider, useMessages } from "next-intl"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"

import { SidebarProvider } from "@/hooks/use-sidebar"

import { TooltipProvider } from "@/components/ui/Tooltip"

export function Providers({
  children,

  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <SidebarProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </SidebarProvider>
    </NextThemesProvider>
  )
}
