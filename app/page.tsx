import FAQs from "@component/showcase/FAQs";
import Pricing from "@component/showcase/Pricing";
import Footer from "@component/navigation/Footer";
import Features from "@component/showcase/Feature";
import HerosectionHome from "@component/showcase/Herohome";
import CallToAction from "@component/showcase/CallToAction";
import EasySteps from "@component/sections/easy-steps/EasySteps";

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
  );
}
