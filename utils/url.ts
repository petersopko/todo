/**
 * Converts a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns The slugified text
 */
export const slugify = (text: string): string => {
  return text
    .normalize("NFD") // Normalize diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};
