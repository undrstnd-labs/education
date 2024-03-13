import "@style/globals.css";

import { GeistSans } from "geist/font";
import { siteConfig } from "@config/site";
import type { Viewport, Metadata } from "next";

import { Analytics } from "@component/config/Analytics";
import { ThemeProvider } from "@component/config/ThemeProvider";
import { TailwindIndicator } from "@component/config/TailwindIndicator";

import { NextIntlClientProvider, useMessages } from "next-intl";

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
};

export const metadata: Metadata = {
  title: {
    default: "Undrstnd - Une meilleure expérience pour les étudiants",
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
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  return (
    <html lang={locale}>
      <head />
      <body className={GeistSans.className}>
        {" "}
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Analytics />
            <TailwindIndicator />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
