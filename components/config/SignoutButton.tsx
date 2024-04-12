"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { DropdownMenuItem } from "@component/ui/DropdownMenu";

export function SignoutButton() {
  const t = useTranslations("Components.Showcase.UserDropdown");

  return (
    <DropdownMenuItem
      className="text-red-600 cursor-pointer"
      onClick={() => {
        signOut();
      }}
    >
      {t("logout")}
    </DropdownMenuItem>
  );
}
