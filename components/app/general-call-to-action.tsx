import Image from "next/image"
import { Link } from "@navigation"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"

export async function GeneralCallToAction() {
  const t = await getTranslations("app.components.app.general-call-to-action")
  return (
    <div className="bg-gray-900 shadow-2xl">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden px-6 pt-16 sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
          aria-hidden="true"
        >
          <circle
            cx={512}
            cy={512}
            r={512}
            fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
            fillOpacity="0.7"
          />
          <defs>
            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
              <stop stopColor="#008080" />
              <stop offset={1} stopColor="#00FFFF" />
            </radialGradient>
          </defs>
        </svg>
        <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("headline-1")}
            <br />
            {t("headline-2")}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            {t("description")}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            <Link href="/register">
              <Button className="bg-white text-gray-900 hover:bg-gray-200">
                {t("join")}
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative mt-16 h-80 lg:mt-8">
          <Image
            className="absolute left-0 top-0 w-[87rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
            src="/images/hero/dark.png"
            alt="App screenshot"
            width={1824}
            height={1080}
          />
        </div>
      </div>
    </div>
  )
}
