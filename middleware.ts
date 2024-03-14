import { locales } from "@config/locale";
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: locales,
  localeDetection: true,
  defaultLocale: "fr",
});

export const config = {
  matcher: ["/", "/(fr|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
