import FeatureList from "@/components/sections/features/FeatureList";

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-cyan-600">
            Efficient learning
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Empower Your Document Experience{" "}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Explore a new dimension of document interaction with our
            cutting-edge features.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl sm:mt-20 lg:mt-10 lg:max-w-none">
          <FeatureList />
        </div>
      </div>
    </div>
  );
}
