/**
 * Utility functions for input sanitization
 */

/**
 * Sanitizes a string by trimming whitespace and removing potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Normalizes suburb name to lowercase and trims whitespace
 * This ensures consistent suburb matching (e.g., "Sydney" === "sydney")
 */
export function normalizeSuburb(suburb: string): string {
  if (typeof suburb !== 'string') {
    return '';
  }
  return suburb.trim().toLowerCase();
}

/**
 * Sanitizes and normalizes suburb name
 */
export function sanitizeAndNormalizeSuburb(suburb: string): string {
  return normalizeSuburb(sanitizeString(suburb));
}
