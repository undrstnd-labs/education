import Footer from "@/components/navigation/Footer"
import EasySteps from "@/components/sections/easy-steps/EasySteps"
import CallToAction from "@/components/showcase/CallToAction"
import FAQs from "@/components/showcase/FAQs"
import Features from "@/components/showcase/Feature"
import HerosectionHome from "@/components/showcase/Herohome"
import Pricing from "@/components/showcase/Pricing"

export default function Home() {
  return (
    <main>
      <HerosectionHome />
      <EasySteps />
      <Features />
      <Pricing />
      <CallToAction />
      <FAQs />
      <Footer />
    </main>
  )
}
