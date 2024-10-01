import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomId = () => {
  return Math.floor(Math.random() * 10 ** 6).toString();
};

export function getColorFromWords(...words: string[]): string {
  const colors = [
    "#F44336",
    "#2196F3",
    "#4CAF50",
    "#FFEB3B",
    "#9C27B0",
    "#FF9800",
  ];

  // Concatenate the words
  const combined = words.join();

  // Simple hash function to convert the string into a number
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const charCode = combined.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0; // Convert to 32bit integer
  }

  // Ensure the hash is positive
  hash = Math.abs(hash);

  // Map the hash to an index between 0 and 5
  const index = hash % colors.length;

  // Return the color
  return colors[index];
}
