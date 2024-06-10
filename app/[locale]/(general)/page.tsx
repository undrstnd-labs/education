import { unstable_setRequestLocale } from "next-intl/server"

import { GeneralCallToAction } from "@/components/app/general-call-to-action"
import { GeneralFeatures } from "@/components/app/general-features"
import { GeneralFAQs } from "@/components/app/general-frequently-asked-questions"
import { GeneralHero } from "@/components/app/general-hero"
import { GeneralTestimonial } from "@/components/app/general-testimonial"

export default function Home({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)

  return (
    <div>
      <GeneralHero />
      <GeneralFeatures />
      <GeneralTestimonial />
      <GeneralCallToAction />
      <GeneralFAQs />
    </div>
  )
}
