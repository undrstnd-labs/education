import Container from "@components/ui/Container";

import FeaturesDesktop from "@components/sections/easy-steps/FeaturesDesktop";
import FeaturesMobile from "@components/sections/easy-steps/FeaturesMobile";

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
            Transformez Votre Expérience avec des Fonctionnalités Avancées
          </h2>
          <p className="mt-2 text-lg text-gray-400">
            Nous comprenons que vous n'êtes pas seulement un étudiant ; vous
            êtes un pionnier. Notre plateforme est spécialement conçue pour les
            étudiants qui recherchent plus que l'ordinaire. Nous allons au-delà
            de l'amélioration de votre parcours académique ; nous le
            redéfinissons.
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
