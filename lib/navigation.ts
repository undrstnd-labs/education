import { createSharedPathnamesNavigation } from "next-intl/navigation"

import { localePrefix, locales } from "@/config/locale"

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales, localePrefix })
