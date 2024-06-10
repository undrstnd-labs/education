import React from "react"
import Image from "next/image"

export function GeneralTestimonial() {
  return (
    <section id="testimonial" className="bg-secondary py-16 sm:py-24">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gray-900 px-6 py-20 shadow-xl sm:rounded-3xl sm:px-10 sm:py-24 md:px-12 lg:px-20">
          <Image
            className="absolute inset-0 h-full w-full object-cover brightness-150 saturate-0"
            src="/images/testimonials/bg.jpg"
            alt="Background"
            width={1097}
            height={845}
          />
          <div className="absolute inset-0 bg-gray-900/90 mix-blend-multiply" />
          <div
            className="absolute -left-80 -top-56 transform-gpu blur-3xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-primary-foreground to-primary opacity-[0.45]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div
            className="hidden md:absolute md:bottom-16 md:left-[50rem] md:block md:transform-gpu md:blur-3xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-r from-primary-foreground to-primary opacity-25"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="relative mx-auto max-w-2xl lg:mx-0">
            <img
              className="h-12 w-auto"
              src="/images/testimonials/groq.png"
              alt=""
            />
            <figure>
              <blockquote className="mt-6 text-lg font-semibold text-white sm:text-xl sm:leading-8">
                <p>
                  “I saw immense potential in your project. I'm pleased to
                  provide you with a free access key, confident that your
                  innovative work will make a significant impact. Keep pushing
                  boundaries; Groq is here to support you.”
                </p>
              </blockquote>
              <figcaption className="mt-6 text-base text-white/80">
                <div className="font-semibold">Michael Gurton</div>
                <div className="mt-1">Special Projects at Groq</div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
