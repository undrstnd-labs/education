import { Link } from "@navigation"

import { marketingConfig } from "@/config/marketing"
import { siteConfig } from "@/config/site"

import { LogoPNG } from "@/components/shared/icons"
import { ThemeSwitch } from "@/components/shared/theme-switch"

export function GeneralFooter() {
  return (
    <footer>
      <div className="container flex flex-col items-center justify-between gap-4 pb-5 pt-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <LogoPNG className="h-6 w-auto" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <Link
              href={siteConfig.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {siteConfig.name}
            </Link>
            . Hosted on{" "}
            <Link
              href="https://vercel.com/"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Vercel
            </Link>
            . The source code is available on{" "}
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
        <ThemeSwitch />
      </div>
      <div className="container flex flex-col items-center justify-between gap-4 pb-6 md:flex-row">
        <p className="text-center text-xs text-secondary-foreground/60">
          &copy; {new Date().getFullYear()} Undrstnd, Inc. All rights reserved.
          Created by{" "}
          <Link
            target="_blank"
            className="text-primary"
            href="https://www.findmalek.com"
          >
            @FindMalek
          </Link>{" "}
          and{" "}
          <Link
            href="https://github.com/aminejguirim10"
            className="text-primary"
          >
            @Jguirim
          </Link>
          .
        </p>
      </div>
    </footer>
  )
}
