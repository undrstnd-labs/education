"use client"

import { useTheme } from "next-themes"

import { Icons } from "@/components/shared/icons"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Theme = "dark" | "system" | "light"

type Props = {
  currentTheme?: Theme
}

const ThemeIcon = ({ currentTheme }: Props) => {
  switch (currentTheme) {
    case "dark":
      return <Icons.moon size={12} />
    case "system":
      return <Icons.monitor size={12} />
    default:
      return <Icons.sun size={12} />
  }
}

export function ThemeSwitch() {
  const { theme, setTheme, themes } = useTheme()

  return (
    <div className="relative flex items-center">
      <Select
        defaultValue={theme}
        onValueChange={(value: Theme) => setTheme(value)}
      >
        <SelectTrigger className="h-[32px] w-full rounded-sm bg-transparent py-1.5 pl-6 pr-3 text-xs capitalize outline-none">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {themes.map((theme) => (
              <SelectItem key={theme} value={theme} className="capitalize">
                {theme}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="pointer-events-none absolute left-2">
        <ThemeIcon currentTheme={theme as Theme} />
      </div>
    </div>
  )
}
