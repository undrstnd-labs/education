import "@styles/globals.css";

import { GeistSans } from "geist/font";
import { siteConfig } from "@config/site";

import { Analytics } from "@components/utils/Analytics";
import { TailwindIndicator } from "@components/utils/TailwindIndicator";
import { ThemeProvider } from "@components/utils/ThemeProvider";

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
    "Auth",
    "Stripe Plans",
    "TypeScript",
    "tRPC",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@shadcn",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head />
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Analytics />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
