import Image from "next/image";
import { Link } from "@lib/navigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bienvenu",
};

export default function Welcome() {
  return (
    <main>
      <div className="max-w-lg px-5 m-auto text-lg prose text-gray-400 mt-8 py-24">
        <Image
          height={200}
          width={200}
          className="h-36 w-auto m-auto"
          src="/images/logos/Rounded.png"
          alt="Logo propre d'Undrstnd."
        />
        <h1 className="mb-0 md:text-6xl text-5xl font-black text-black text-neutral-90 py-8">
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
            className="text-sky-500 text-lg font-semibold underline"
          >
            GitHub
          </Link>
          , rejoignez-nous sur{" "}
          <Link
            href="https://discord.gg/j9WY4pfE4h"
            className="text-sky-500 text-lg font-semibold underline"
          >
            Discord
          </Link>{" "}
          et suivez{" "}
          <span className="text-sky-500 text-lg font-semibold">@Undrstnd</span>{" "}
          pour vous impliquer !
        </p>

        <br />
        <p>
          Ou bien, vous pouvez nous contacter via{" "}
          <Link
            className="text-sky-500 text-lg font-semibold"
            href="https://www.findmalek.com"
          >
            @FindMalek
          </Link>{" "}
          oui{" "}
          <Link className="text-sky-500 text-lg font-semibold" href="#">
            @Jguirim
          </Link>{" "}
        </p>
      </div>
    </main>
  );
}
