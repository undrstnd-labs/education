import "@/styles/globals.css"

import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { NextIntlClientProvider, useMessages } from "next-intl"
import { getTranslations } from "next-intl/server"

import { siteConfig } from "@/config/site"

import { Toaster } from "@/components/ui/Toaster"
import { Analytics } from "@/components/config/Analytics"
import { Providers } from "@/components/config/Providers"
import { TailwindIndicator } from "@/components/config/TailwindIndicator"

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

export default function PrincipalLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = useMessages()
  return (
    <html lang={locale}>
      <head />
      <body className={GeistSans.className}      >
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
