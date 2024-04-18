"use client";

import { featuresList } from "@config/features";

export function FeatureList() {
  return (
    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-6 lg:max-w-none lg:grid-cols-3">
      {featuresList.map((feature) => (
        <div
          key={feature.name}
          className="flex flex-col rounded-lg border-2 border-solid border-gray-300/30 p-4 shadow-sm"
        >
          <feature.icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <dt className="pt-4 text-base font-semibold leading-7 text-gray-900">
            {feature.name}
          </dt>
          <dd className="flex flex-auto flex-col text-base leading-7 text-gray-600">
            <p className="flex-auto">{feature.description}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Apprentissage efficace
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Optimisez votre expérience documentaire{" "}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Explorez une nouvelle dimension de l'interaction documentaire avec
            nos fonctionnalités de pointe.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl sm:mt-20 lg:mt-10 lg:max-w-none">
          <FeatureList />
        </div>
      </div>
    </div>
  );
}
