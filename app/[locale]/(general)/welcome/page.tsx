import type { Metadata } from "next"
import Image from "next/image"
import { Link } from "@navigation"

export const metadata: Metadata = {
  title: "Bienvenu",
}

export default function Welcome() {
  return (
    <main>
      <div className="prose m-auto mt-8 max-w-lg px-5 py-24 text-lg text-gray-400">
        <Image
          height={200}
          width={200}
          className="m-auto h-36 w-auto"
          src="/images/logos/Rounded.png"
          alt="Logo propre d'Undrstnd."
        />
        <h1 className="text-neutral-90 mb-0 py-8 text-5xl font-black text-black md:text-6xl">
          👋 Bienvenue sur Undrstnd !
        </h1>
        <p>
          Après une pause bien méritée, nous insufflons une nouvelle vie à
          Undrstnd ! Il se réinvente en tant qu'application d&apos;amélioration
          intelligente de support enseignement, totalement transparente, open
          source, et soutenue par la communauté !
        </p>
        <br />
        <p>
          Notre mission est de rendre l&apos;enseignement plus accessible et
          inclusif. Nous voulons aider les enseignants à comprendre et à
          soutenir les besoins de leurs élèves, en fournissant des informations
          sur les performances et les besoins de chaque élève, en temps réel.
        </p>
        <br />
        <p>
          Consultez notre dépôt sur{" "}
          <Link
            href="https://github.com/FindMalek/undrstnd"
            className="text-lg font-semibold text-sky-500 underline"
          >
            GitHub
          </Link>
          , rejoignez-nous sur{" "}
          <Link
            href="https://discord.gg/j9WY4pfE4h"
            className="text-lg font-semibold text-sky-500 underline"
          >
            Discord
          </Link>{" "}
          et suivez{" "}
          <span className="text-lg font-semibold text-sky-500">@Undrstnd</span>{" "}
          pour vous impliquer !
        </p>

        <br />
        <p>
          Ou bien, vous pouvez nous contacter via{" "}
          <Link
            className="text-lg font-semibold text-sky-500"
            href="https://www.findmalek.com"
          >
            @FindMalek
          </Link>{" "}
          oui{" "}
          <Link className="text-lg font-semibold text-sky-500" href="#">
            @Jguirim
          </Link>{" "}
        </p>
      </div>
    </main>
  )
}
