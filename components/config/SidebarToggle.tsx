"use client";

import * as React from "react";

import { useSidebar } from "@hook/use-sidebar";

import { Button } from "@component/ui/Button";
import { Icons } from "@component/icons/Lucide";

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      className="-ml-2 hidden size-9 p-0 lg:flex"
      onClick={() => {
        toggleSidebar();
      }}
    >
      <Icons.panelRight className="size-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
