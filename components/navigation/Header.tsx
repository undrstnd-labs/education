"use client"

import { Popover } from "@headlessui/react"
import { Link } from "@navigation"

import MobileAnimatePresence from "@/components/navigation/MobileAnimatePresence"
import NavLinks from "@/components/navigation/NavLinks"
import { Icons, LogoPNG } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export default function Header() {
  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center gap-10">
            <Link href="/" aria-label="Home">
              <div className="flex items-center gap-2">
                <LogoPNG className="-mt-1 h-7 w-auto" />
                <p className="text-base font-bold text-zinc-700 dark:text-zinc-300 ">
                  Undrstnd
                </p>
              </div>
            </Link>
            <div className="hidden lg:flex lg:gap-10">
              <NavLinks />
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
                  <MobileAnimatePresence open={open} />
                </>
              )}
            </Popover>
            <Link href="/login">
              <Button variant="outline" className="hidden lg:block">
                Se connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button className="hidden lg:block">Créer un compte</Button>
            </Link>
          </div>
        </Container>
      </nav>
    </header>
  )
}
