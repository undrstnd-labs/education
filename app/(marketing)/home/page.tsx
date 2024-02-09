import Features from "@components/sections/features/Features";
import HerosectionHome from "@components/sections/herosections/HerosectionHome";
import EasySteps from "@components/sections/easy-steps/EasySteps";
import Pricing from "@components/sections/pricing/Pricing";
import CallToAction from "@components/sections/call-to-action/CallToAction";
import FAQs from "@components/sections/frequently-asked-questions/Frequently-Asked-Questions";
import Footer from "@components/sections/navigation/Footer";

export default function Home() {
  return (
    <>
      <HerosectionHome />
      <EasySteps />
      <Features />
      <Pricing />
      <CallToAction />
      <FAQs />
      <Footer />
    </>
  );
}
