"use client";

import { useTheme } from "next-themes";
import { Icons } from "@component/icons/Lucide";

type Theme = "dark" | "system" | "light";

type Props = {
  currentTheme?: Theme;
};

const ThemeIcon = ({ currentTheme }: Props) => {
  switch (currentTheme) {
    case "dark":
      return <Icons.moon size={12} />;
    case "system":
      return <Icons.monitor size={12} />;
    default:
      return <Icons.sun size={12} />;
  }
};

export function ThemeSwitch() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="flex items-center relative">
      <select
        className="text-xs border rounded-md appearance-none pl-6 pr-6 py-1.5 dark:bg-black outline-none capitalize w-full"
        defaultValue={theme}
        onChange={(event) => setTheme(event.target.value)}
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>

      <div className="absolute left-2 pointer-events-none">
        <ThemeIcon currentTheme={theme as Theme} />
      </div>

      <div className="absolute right-2">
        <Icons.chevronsUpDown size={12} />
      </div>
    </div>
  );
}
