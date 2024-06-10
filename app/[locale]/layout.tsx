import "@/styles/globals.css"

import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { NextIntlClientProvider, useMessages } from "next-intl"
import { getTranslations, unstable_setRequestLocale } from "next-intl/server"

import { locales } from "@/config/locale"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { Analytics } from "@/components/layout/analytics"
import { Providers } from "@/components/layout/providers"
import { TailwindIndicator } from "@/components/layout/tailwind-indicator"
import { Toaster } from "@/components/ui/toaster"

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Layout.PrincipalLayout")
  return {
    title: {
      default: `${t("title")}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Server Components",
      "Auth",
      "TypeScript",
      "Langchain",
      "Pinecon",
      "Prisma",
    ],
    authors: [
      {
        name: "FindMalek",
        url: "https://findmalek.com/",
      },
      {
        name: "Mohamed Amine Jguirim",
        url: "#",
      },
    ],
    creator: "FindMalek",
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: "@foundmalek",
    },
    icons: {
      icon: "/favicons/favicon.ico",
      shortcut: "/favicons/favicon-16x16.png",
      apple: "/favicons/apple-touch-icon.png",
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
    metadataBase: new URL(siteConfig.url),
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function PrincipalLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)

  const messages = useMessages()
  return (
    <html lang={locale} suppressHydrationWarning>
      <head />
      <body className={cn(GeistSans.className, "bg-secondary")}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            {children}
            <Toaster />
            <Analytics />
            <TailwindIndicator />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
