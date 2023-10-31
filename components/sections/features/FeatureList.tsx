"use client";

import { featuresList } from "@lib/consts";

export default function FeatureList() {
  return (
    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-6 lg:max-w-none lg:grid-cols-3">
      {featuresList.map((feature) => (
        <div
          key={feature.name}
          className="flex flex-col p-4 border-solid border-2 border-gray-300/30 rounded-lg shadow-sm"
        >
          <feature.icon className="h-5 w-5 text-cyan-600" aria-hidden="true" />
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
