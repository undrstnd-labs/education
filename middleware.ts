import createMiddleware from "next-intl/middleware";
import { locales } from "@/config/locale";

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  localeDetection: false,
  defaultLocale: "fr",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(fr|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
