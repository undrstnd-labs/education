"use client"

import React from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

export function ToggleThemeImage({
  lightSrc,
  darkSrc,
  alt,
  className,
}: {
  lightSrc: string
  darkSrc: string
  alt: string
  className?: string
}) {
  const { theme, themes } = useTheme()

  return (
    <Image
      src={theme === "dark" ? darkSrc : lightSrc}
      alt={alt}
      className={className}
      width={1600}
      height={1600}
    />
  )
}
