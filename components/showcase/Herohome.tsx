import Image from "next/image"
import { Link } from "@navigation"

import { PlayIcon } from "@/components/icons/Overall"
import { Button } from "@/components/ui/Button"
import { TypingEffect } from "@/components/ui/TypingEffect"

export default function HerosectionHome() {
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
      <div className="lg:py-18 mx-auto max-w-7xl px-6 pt-10 sm:pb-32 lg:flex lg:px-8 lg:pb-36">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:shrink-0 lg:pt-8">
          <h1 className="mt-10 flex flex-col text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
            Libérez les insights des documents avec{" "}
            <span className="self-start text-sky-500">
              <TypingEffect text="Undrstnd" />
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Élevez votre expérience documentaire avec Undrstnd. Il vous suffit
            de télécharger vos fichiers et de commencer à explorer.
          </p>

          <div className="mt-10 flex items-center gap-x-6">
            <Link href="/register">
              <Button className="font-semibold">Commencer</Button>
            </Link>

            <Link
              target="_blank"
              href="https://www.youtube.com/shorts/-1UjTQhkvLU"
            >
              <Button variant="outline">
                <PlayIcon className="size-6 flex-none" />
                <span className="ml-2.5">
                  Regarder la vidéo de démonstration
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              {/**
               * TODO: Image for light and dark mode
               */}
              <Image
                src="https://tailwindui.com/img/component-images/project-app-screenshot.png"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
