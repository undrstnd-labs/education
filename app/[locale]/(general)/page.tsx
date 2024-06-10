import { unstable_setRequestLocale } from "next-intl/server"

import { GeneralHero } from "@/components/app/general-hero"
import CallToAction from "@/components/showcase/CallToAction"
import FAQs from "@/components/showcase/FAQs"
import Features from "@/components/showcase/Feature"
import Pricing from "@/components/showcase/Pricing"

export default function Home({
  params: { locale },
}: {
  params: { locale: string }
}) {
  unstable_setRequestLocale(locale)

  return (
    <div>
      <GeneralHero />
      <Features />
      <Pricing />
      <CallToAction />
      <FAQs />
    </div>
  )
}
