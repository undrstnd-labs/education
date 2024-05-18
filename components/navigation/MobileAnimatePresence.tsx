"use client"

import { Popover } from "@headlessui/react"
import { Link } from "@navigation"
import { AnimatePresence, motion } from "framer-motion"

import MobileNavLink from "@/components/navigation/MobileNavLink"
import { Button } from "@/components/ui/button"

export default function MobileAnimatePresence({ open }: { open: boolean }) {
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
              <MobileNavLink href="#features">Features</MobileNavLink>
              <MobileNavLink href="#reviews">Reviews</MobileNavLink>
              <MobileNavLink href="#pricing">Pricing</MobileNavLink>
              <MobileNavLink href="#faqs">FAQs</MobileNavLink>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="#">
                <Button className="w-full">Register for an Account</Button>
              </Link>
            </div>
          </Popover.Panel>
        </>
      )}
    </AnimatePresence>
  )
}
