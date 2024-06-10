"use client"

import { Popover } from "@headlessui/react"
import { Link } from "@navigation"
import { useTranslations } from "next-intl"

import { GeneralHeaderMobile } from "@/components/layout/general-header-mobile"
import { GeneralHeaderNavLinks } from "@/components/layout/general-header-nav-links"
import { Icons, LogoPNG } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export function GeneralHeader() {
  const t = useTranslations("app.components.layout.general-header")

  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center gap-10">
            <Link href="/" aria-label="Home">
              <div className="flex items-center gap-2">
                <LogoPNG className="-mt-1 h-7 w-auto" />
                <p className="text-base font-bold text-secondary-foreground">
                  Undrstnd
                </p>
              </div>
            </Link>
            <div className="hidden lg:flex lg:gap-10">
              <GeneralHeaderNavLinks />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Popover className="lg:hidden">
              {({ open }) => (
                <>
                  <Popover.Button
                    className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-800/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none"
                    aria-label="Toggle site navigation"
                  >
                    {({ open }) =>
                      open ? (
                        <Icons.chevronUp className="size-6" />
                      ) : (
                        <Icons.menu className="size-6" />
                      )
                    }
                  </Popover.Button>
                  <GeneralHeaderMobile open={open} />
                </>
              )}
            </Popover>
            <Link href="/login">
              <Button variant="outline" className="hidden lg:block">
                {t("login")}
              </Button>
            </Link>
            <Link href="/register">
              <Button className="hidden lg:block"> {t("register")}</Button>
            </Link>
          </div>
        </Container>
      </nav>
    </header>
  )
}
