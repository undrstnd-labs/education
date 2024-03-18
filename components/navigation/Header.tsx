"use client";

import Link from "next/link";
import { Popover } from "@headlessui/react";

import { Button } from "@component/ui/Button";
import Container from "@component/ui/Container";

import { LogoPNG } from "@component/icons/Overall";
import { MenuIcon, ChevronUpIcon } from "@component/icons/Navbar";

import NavLinks from "@/components/navigation/NavLinks";
import MobileAnimatePresence from "@/components/navigation/MobileAnimatePresence";

export default function Header() {
  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center gap-10">
            <Link href="/" aria-label="Home">
              <div className="flex items-center gap-2">
                <LogoPNG className="-mt-1 h-7 w-auto" />
                <p className="text-zinc-700 dark:text-zinc-300 text-base font-bold ">Undrstnd</p>
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
                        <ChevronUpIcon className="h-6 w-6" />
                      ) : (
                        <MenuIcon className="h-6 w-6" />
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
  );
}
