import React from "react"
import { getTranslations } from "next-intl/server"

import { Icons } from "@/components/shared/icons"
import { ToggleThemeImage } from "@/components/shared/toggle-theme-image"

const features = (t: (arg: string) => string) => [
  {
    icon: (
      <Icons.post
        className="absolute left-1 top-1 h-5 w-5 text-primary"
        aria-hidden="true"
      />
    ),
    name: t("features.feature-1.name"),
    description: t("features.feature-1.description"),
  },
  {
    icon: (
      <Icons.teacher
        className="absolute left-1 top-1 h-5 w-5 text-primary"
        aria-hidden="true"
      />
    ),
    name: t("features.feature-2.name"),
    description: t("features.feature-2.description"),
  },
  {
    icon: (
      <Icons.chat
        className="absolute left-1 top-1 h-5 w-5 text-primary"
        aria-hidden="true"
      />
    ),
    name: t("features.feature-3.name"),
    description: t("features.feature-3.description"),
  },
  {
    icon: (
      <Icons.refresh
        className="absolute left-1 top-1 h-5 w-5 text-primary"
        aria-hidden="true"
      />
    ),
    name: t("features.feature-4.name"),
    description: t("features.feature-4.description"),
  },
  {
    icon: (
      <Icons.lock
        className="absolute left-1 top-1 h-5 w-5 text-primary"
        aria-hidden="true"
      />
    ),
    name: t("features.feature-5.name"),
    description: t("features.feature-5.description"),
  },
  {
    icon: (
      <Icons.idea
        className="absolute left-1 top-1 h-5 w-5 text-primary"
        aria-hidden="true"
      />
    ),
    name: t("features.feature-6.name"),
    description: t("features.feature-6.description"),
  },
]

export async function GeneralFeatures() {
  const t = await getTranslations("app.components.app.general-features")

  return (
    <div className="py-12 sm:py-8">
      <div className="mx-auto max-w-7xl px-6  lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            {t("headline")}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-secondary-foreground sm:text-4xl">
            {t("subheadline")}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t("description")}
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ToggleThemeImage
            lightSrc="/images/hero/light.png"
            darkSrc="/images/hero/dark.png"
            alt="Undrstnd screenshot"
            className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-secondary-foreground/10"
          />
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-secondary/50 pt-[7%]" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 text-base leading-7 text-secondary-foreground/60 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-6">
          {features(t).map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-secondary-foreground">
                {feature.icon}
                {feature.name}
              </dt>
              <dd>{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
