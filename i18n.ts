import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { locales } from "@/config/locale";

// Can be imported from a shared config

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`@data/locale/${locale}.json`)).default,
  };
});
