import { useState } from "react";
import { Link } from "@lib/navigation";

import { AnimatePresence } from "framer-motion";

import { marketingConfig } from "@config/marketing";
import PresenceAnimate from "@/components/navigation/PresenceAnimate";

export default function NavLinks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return marketingConfig.mainNav.map(({ title, href }, index) => (
    <Link
      key={title}
      href={href}
      className="hover:delay-[150ms] relative -mx-3 -my-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
      onMouseEnter={() => {
        setHoveredIndex(index);
      }}
      onMouseLeave={() => {
        setHoveredIndex(null);
      }}
    >
      <AnimatePresence>
        {hoveredIndex === index && <PresenceAnimate />}
      </AnimatePresence>
      <span className="relative z-10">{title}</span>
    </Link>
  ));
}
