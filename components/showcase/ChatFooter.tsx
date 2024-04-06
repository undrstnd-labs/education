import React from "react";
import { useTranslations } from "next-intl";

import { cn } from "@lib/utils";
import { ExternalLink } from "@component/ui/ExternalLink";

export function FooterText({ className, ...props }: React.ComponentProps<"p">) {
  const t = useTranslations("Components.Showcase.ChatFooter");
  return (
    <p
      className={cn(
        "px-2 text-center text-xs leading-normal text-muted-foreground",
        className
      )}
      {...props}
    >
      <ExternalLink href="https://undrstnd.vercel.app">Undrstnd</ExternalLink>{" "}
      {t("footer-text-1")}{" "}
      <ExternalLink href="https://undrstnd.vercel.app/about/docs">
        documentation
      </ExternalLink>{" "}
      {t("footer-text-2")}
    </p>
  );
}
