import { Link } from "@navigation"
import { getTranslations } from "next-intl/server"

import { buttonVariants } from "@/components/ui/button"

const faqs = (t: (arg: string) => string) => [
  {
    id: 1,
    question: t("faqs.question-1.question"),
    answer: t("faqs.question-1.answer"),
  },
  {
    id: 2,
    question: t("faqs.question-2.question"),
    answer: t("faqs.question-2.answer"),
  },
  {
    id: 3,
    question: t("faqs.question-3.question"),
    answer: t("faqs.question-3.answer"),
  },
  {
    id: 4,
    question: t("faqs.question-4.question"),
    answer: t("faqs.question-4.answer"),
  },
  {
    id: 5,
    question: t("faqs.question-5.question"),
    answer: t("faqs.question-5.answer"),
  },
  {
    id: 6,
    question: t("faqs.question-6.question"),
    answer: t("faqs.question-6.answer"),
  },
  {
    id: 7,
    question: t("faqs.question-7.question"),
    answer: t("faqs.question-7.answer"),
  },
  {
    id: 8,
    question: t("faqs.question-8.question"),
    answer: t("faqs.question-8.answer"),
  },
  {
    id: 9,
    question: t("faqs.question-9.question"),
    answer: t("faqs.question-9.answer"),
  },
]

export async function GeneralFAQs() {
  const t = await getTranslations("app.components.app.general-faqs")
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl text-left">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-secondary-foreground">
          {t("headline")}
        </h2>
        <p className="mt-6 text-base leading-7 text-secondary-foreground/70">
          {t("description-1")}
          <Link
            href="mailto:contact@findmalek.com"
            className={buttonVariants({
              variant: "link",
            })}
          >
            {t("email")}
          </Link>{" "}
          {t("description-2")}
        </p>
      </div>
      <div className="mt-20">
        <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
          {faqs(t).map((faq) => (
            <div key={faq.id}>
              <dt className="text-base font-semibold leading-7 text-secondary-foreground">
                {faq.question}
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
