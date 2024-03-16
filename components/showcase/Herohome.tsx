import Link from "next/link";
import Image from "next/image";

import { Button } from "@component/ui/Button";
import { PlayIcon } from "@component/icons/Overall";
import { TypingEffect } from "@component/ui/TypingEffect";

export default function HerosectionHome() {
  return (
    <div className="relative isolate overflow-hidden">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
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
      <div className="mx-auto max-w-7xl px-6 pt-10 sm:pb-32 lg:flex lg:px-8 lg:pb-36 lg:py-18">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <h1 className="mt-10 text-4xl flex flex-col font-bold tracking-tight text-gray-900 sm:text-6xl">
            Libérez les insights des documents avec{" "}
            <span className="text-sky-500 self-start">
              <TypingEffect text="Undrstnd" />
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
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
                <PlayIcon className="h-6 w-6 flex-none" />
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
  );
}
