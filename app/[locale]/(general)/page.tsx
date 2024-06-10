import { unstable_setRequestLocale } from "next-intl/server"

import { GeneralCallToAction } from "@/components/app/general-call-to-action"
import { GeneralFeatures } from "@/components/app/general-features"
import { GeneralHero } from "@/components/app/general-hero"
import { GeneralTestimonial } from "@/components/app/general-testimonial"
import FAQs from "@/components/showcase/FAQs"

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
      <FAQs />
    </div>
  )
}
