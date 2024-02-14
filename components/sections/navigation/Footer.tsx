import Link from "next/link";

import { marketingConfig } from "@config/marketing";
import { siteConfig } from "@config/site";

import { Icons } from "@components/icons/Icons";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {marketingConfig.mainNav.map((item) => (
            <div key={item.title} className="pb-6">
              <Link
                href={item.href}
                className="text-sm leading-6 px-3 py-2 rounded-xl transition-colors delay-75 hover:delay-[150ms] text-gray-600 hover:text-gray-900 hover:bg-slate-300/40"
              >
                {item.title}
              </Link>
            </div>
          ))}
        </nav>

        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} Undrstnd, Inc. All rights reserved.
          Created by{" "}
          <Link
            target="_blank"
            className="text-blue-600"
            href="https://www.findmalek.com"
          >
            @FindMalek
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-blue-600">
            @Jguirim
          </Link>
          .
        </p>

        <div className="mt-10 flex justify-center space-x-10">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Github</span>
            <Icons.gitHub className="h-6 w-6" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
