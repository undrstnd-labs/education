import Image from "next/image"
import { TranslationFunction, University } from "@/types"

import { Icons } from "@/components/icons/Lucide"

export function UniversityCard({
  university,
  t,
}: {
  university: University
  t: TranslationFunction
}) {
  return (
    <div
      key={university.email}
      className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white/70 shadow"
    >
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-medium text-gray-900">
              {university.abbrev}
            </h3>
          </div>
          <p className="mt-1 break-before-auto text-sm text-gray-500">
            {university.label}
          </p>
        </div>
        <Image
          className="size-10 shrink-0 rounded-md bg-gray-300"
          src={university.avatarUrl}
          alt={university.label}
          width={400}
          height={600}
        />
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <a
              href={`mailto:${university.email}`}
              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <Icons.mail className="size-5 text-gray-400" aria-hidden="true" />
              {t("email")}
            </a>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <a
              href={`tel:${university.phone}`}
              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
            >
              <Icons.phone
                className="size-5 text-gray-400"
                aria-hidden="true"
              />
              {t("phone")}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
