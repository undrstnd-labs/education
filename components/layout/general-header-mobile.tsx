"use client"

import { Popover } from "@headlessui/react"
import { Link } from "@navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"

import { marketingConfig } from "@/config/marketing"

import { GeneralHeaderMobileNavLink } from "@/components/layout/general-header-nav-links"
import { Button } from "@/components/ui/button"

export function GeneralHeaderMobile({ open }: { open: boolean }) {
  const t = useTranslations("app.components.layout.general-header")
  return (
    <AnimatePresence initial={false}>
      {open && (
        <>
          <Popover.Overlay
            static
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
          />
          <Popover.Panel
            static
            as={motion.div}
            initial={{ opacity: 0, y: -32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -32,
              transition: { duration: 0.2 },
            }}
            className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
          >
            <div className="space-y-4">
              {marketingConfig(t).mainNav.map((nav) => (
                <GeneralHeaderMobileNavLink key={nav.href} href={nav.href}>
                  {nav.title}
                </GeneralHeaderMobileNavLink>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full">{t("register")}</Button>
              </Link>
            </div>
          </Popover.Panel>
        </>
      )}
    </AnimatePresence>
  )
}
