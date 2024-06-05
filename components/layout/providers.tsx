"use client"

import * as React from "react"

import { SidebarProvider } from "@/hooks/use-sidebar"

import { ThemeProvider } from "@/components/layout/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}
