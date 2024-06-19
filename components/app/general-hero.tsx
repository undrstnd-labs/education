import { Link } from "@navigation"
import { getTranslations } from "next-intl/server"

import { Icons } from "@/components/shared/icons"
import { ToggleThemeImage } from "@/components/shared/toggle-theme-image"
import { Button } from "@/components/ui/button"
import { TypingEffect } from "@/components/ui/typing-effect"

export async function GeneralHero() {
  const t = await getTranslations("app.components.app.general-hero")

  return (
    <div className="relative isolate overflow-hidden">
      <svg
        className="absolute inset-0 -z-10 size-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
        />
      </svg>
      <div className="lg:py-18 mx-auto max-w-7xl px-6 pt-10 sm:pb-32 lg:flex lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:shrink-0 lg:pt-8">
          <h1 className="mt-10 flex flex-col text-4xl font-bold tracking-tight text-secondary-foreground sm:text-6xl">
            {t("headline-1")}{" "}
            <span className="self-start text-sky-500">
              <TypingEffect text="Undrstnd" />
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-secondary-foreground/60">
            {t("headline-2")}
          </p>

          <div className="mt-10 flex items-center gap-x-6">
            <Link href="/register">
              <Button
                className="font-semibold"
                variant="expandIcon"
                Icon={Icons.chevronRight}
                iconPlacement="right"
              >
                {t("get-started")}
              </Button>
            </Link>

            <Link target="_blank" href="https://github.com/findmalek/undrstnd">
              <Button variant="outline">
                <Icons.gitHub className="size-5 flex-none" />
                <span className="ml-2.5">{t("star-us")}</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <ToggleThemeImage
                lightSrc="/images/hero/light.png"
                darkSrc="/images/hero/dark.png"
                alt="App screenshot"
                className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
