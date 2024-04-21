import { Link } from "@navigation"

const faqs = [
  {
    id: 1,
    question: "How can I apply for the beta?",
    answer:
      "To apply for the beta, you must apply for the waitlist. We will send you an email with instructions on how to get started.",
  },
  {
    id: 2,
    question: "How can I apply for the Educator Pack?",
    answer:
      "We support the students and educators who are working hard to learn and teach. To apply for the Educator Pack, you should login with your school email address or simply login with Github to verify your student status.",
  },
  {
    id: 3,
    question: "How can I try out the app?",
    answer:
      "We offer a free pack, but with limited features. You can try out the app by signing up for the free pack and try it right now.",
  },
]

export default function FAQs() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl text-left">
        <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
          Frequently asked questions
        </h2>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Have a different question and can&apos;t find the answer you&apos;re
          looking for? Reach out to our support team by{" "}
          <Link
            href="/contact"
            className="font-semibold text-sky-600 hover:text-sky-500"
          >
            sending us a message
          </Link>{" "}
          and we&apos;ll get back to you as soon as we can.
        </p>
      </div>
      <div className="mt-20">
        <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
          {faqs.map((faq) => (
            <div key={faq.id}>
              <dt className="text-base font-semibold leading-7 text-gray-900">
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
