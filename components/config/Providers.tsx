"use client"

import * as React from "react"

import { SidebarProvider } from "@/hooks/use-sidebar"

import { TooltipProvider } from "@/components/ui/Tooltip"
import { ThemeProvider } from "@/components/config/ThemeProvider"

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
