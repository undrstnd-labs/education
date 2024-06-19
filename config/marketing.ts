import { MarketingConfig } from "@/types"

export const marketingConfig = (
  t: (arg: string) => string
): MarketingConfig => ({
  mainNav: [
    {
      title: t("features"),
      href: "/#features",
    },
    {
      title: t("testimonials"),
      href: "/#testimonial",
    },
    {
      title: t("faqs"),
      href: "/#faqs",
    },
  ],
})
