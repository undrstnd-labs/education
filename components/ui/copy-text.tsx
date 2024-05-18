"use client"

import React from "react"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

import { Icons } from "@/components/shared/icons"

interface CopyTextProps {
  text: string
}

export function CopyText({ text }: CopyTextProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  return (
    <code
      onClick={() => copyToClipboard(text)}
      className={`relative flex cursor-pointer items-center rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold hover:bg-accent/80 hover:text-secondary-foreground`}
    >
      {text}
      <button className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-muted  hover:bg-accent hover:text-secondary-foreground">
        {isCopied ? (
          <Icons.check className="h-4 w-4" />
        ) : (
          <Icons.copy className="h-4 w-4" />
        )}
      </button>
    </code>
  )
}
