import Container from "@/components/ui/Container";

import FeaturesDesktop from "@/components/sections/easy-steps/FeaturesDesktop";
import FeaturesMobile from "@/components/sections/easy-steps/FeaturesMobile";

export default function EasySteps() {
  return (
    <section
      id="features"
      aria-label="Features for investing all your money"
      className="bg-gray-900 py-20 sm:py-32 "
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
          <h2 className="text-3xl font-medium tracking-tight text-white">
            Transform Your Experience with Advanced Features
          </h2>
          <p className="mt-2 text-lg text-gray-400">
            We understand you're not just a student; you're a trailblazer. Our
            platform is custom-crafted for students who seek more than the
            ordinary. We go beyond enhancing your academic journey; we redefine
            it.
          </p>
        </div>
        <div className="mt-16 md:hidden">
          <FeaturesMobile />
        </div>
        <div className="hidden md:mt-20 md:block">
          <FeaturesDesktop />
        </div>
      </Container>
    </section>
  );
}
