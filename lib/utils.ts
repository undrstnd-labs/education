import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

import { emailSchema } from "@config/schema";

/**
 * Combines class names into a single string with deduplicated classes.
 * Uses `clsx` for generating a combined class string and `twMerge` to merge Tailwind CSS classes.
 * @param {...ClassValue[]} inputs - Class names to combine.
 * @return {string} The combined class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function verifyEmail(email: string): boolean {
  return emailSchema.safeParse({ email }).success;
}
