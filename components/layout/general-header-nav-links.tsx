import { useState } from "react"
import { Popover } from "@headlessui/react"
import { Link } from "@navigation"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"

import { marketingConfig } from "@/config/marketing"

function PresenceAnimate() {
  return (
    <motion.span
      className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-800/50"
      layoutId="hoverBackground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.15 } }}
      exit={{
        opacity: 0,
        transition: { duration: 0.15, delay: 0.2 },
      }}
    />
  )
}

export function GeneralHeaderMobileNavLink({
  children,
  href,
}: {
  children: React.ReactNode
  href: string
}) {
  return (
    <Popover.Button
      as={Link}
      className="block text-base leading-7 tracking-tight text-gray-700"
      href={href}
    >
      {children}
    </Popover.Button>
  )
}

export function GeneralHeaderNavLinks() {
  const t = useTranslations("app.components.layout.general-header")
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return marketingConfig(t).mainNav.map(({ title, href }, index) => (
    <Link
      key={title}
      href={href}
      className="relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900 hover:delay-150 dark:text-gray-300 dark:hover:text-gray-100"
      onMouseEnter={() => {
        setHoveredIndex(index)
      }}
      onMouseLeave={() => {
        setHoveredIndex(null)
      }}
    >
      <AnimatePresence>
        {hoveredIndex === index && <PresenceAnimate />}
      </AnimatePresence>
      <span className="relative z-10">{title}</span>
    </Link>
  ))
}
