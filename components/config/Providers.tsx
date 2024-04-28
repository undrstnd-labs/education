"use client"

import * as React from "react"
import { NextIntlClientProvider, useMessages } from "next-intl"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"

import { SidebarProvider } from "@/hooks/use-sidebar"

import { TooltipProvider } from "@/components/ui/Tooltip"

export function Providers({
  children,
  locale,
  ...props
}: ThemeProviderProps & { locale: string }) {
  const messages = useMessages()

  return (
    <NextThemesProvider {...props}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <SidebarProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SidebarProvider>
      </NextIntlClientProvider>
    </NextThemesProvider>
  )
}
