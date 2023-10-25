import { forwardRef, SVGProps, ReactNode } from "react";
import clsx from "clsx";

function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 659.66 191.16" {...props}>
      <g id="Layer_1">
        <circle
          cx="85.59"
          cy="102.92"
          r="79.59"
          fill="#0ea5e9"
          stroke="#0ea5e9"
          stroke-miterlimit="10"
          stroke-width="12"
        />
        <text
          transform="translate(29.39 97.27) rotate(45) scale(.86 1)"
          fill="#0ea5e9"
          font-family="MyriadPro-Regular, 'Myriad Pro'"
          font-size="164.35"
        >
          <tspan x="0" y="0">
            U
          </tspan>
        </text>
        <path
          d="m85.68,25.59h45.78v91.46c0,12.63-10.26,22.89-22.89,22.89h0c-12.63,0-22.89-10.26-22.89-22.89V25.59h0Z"
          transform="translate(90.32 -52.53) rotate(45)"
          fill="#111827"
        />
      </g>
      <g id="Layer_2">
        <text
          transform="translate(250.34 144.06)"
          fill="#f2f2f2"
          font-family="Roboto-Medium, Roboto"
          font-size="100"
          font-weight="500"
        >
          <tspan x="0" y="0">
            Undrstnd
          </tspan>
        </text>
      </g>
    </svg>
  );
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.696 19h10.608c1.175 0 2.08-.935 1.532-1.897C18.028 15.69 16.187 14 12 14s-6.028 1.689-6.836 3.103C4.616 18.065 5.521 19 6.696 19Z"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AppScreen({
  children,
  className,
  ...props
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("flex flex-col", className)} {...props}>
      <div className="flex justify-between px-4 pt-4">
        <MenuIcon className="h-6 w-6 flex-none" />
        <Logo className="h-6 flex-none" />
        <UserIcon className="h-6 w-6 flex-none" />
      </div>
      {children}
    </div>
  );
}

AppScreen.Header = forwardRef<HTMLDivElement, { children: ReactNode }>(
  function AppScreenHeader({ children }, ref) {
    return (
      <div ref={ref} className="mt-6 px-4 text-white">
        {children}
      </div>
    );
  }
);

AppScreen.Title = forwardRef<HTMLDivElement, { children: ReactNode }>(
  function AppScreenTitle({ children }, ref) {
    return (
      <div ref={ref} className="text-2xl text-white">
        {children}
      </div>
    );
  }
);

AppScreen.Subtitle = forwardRef<HTMLDivElement, { children: ReactNode }>(
  function AppScreenSubtitle({ children }, ref) {
    return (
      <div ref={ref} className="text-sm text-gray-500">
        {children}
      </div>
    );
  }
);

AppScreen.Body = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string }
>(function AppScreenBody({ children, className }, ref) {
  return (
    <div
      ref={ref}
      className={clsx("mt-6 flex-auto rounded-t-2xl bg-white", className)}
    >
      {children}
    </div>
  );
});
