import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

/**
 * Combines class names into a single string with deduplicated classes.
 * Uses `clsx` for generating a combined class string and `twMerge` to merge Tailwind CSS classes.
 * @param {...ClassValue[]} inputs - Class names to combine.
 * @return {string} The combined class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
