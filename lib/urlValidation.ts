/**
 * Validates a URL to ensure it uses a safe protocol
 * Prevents XSS attacks via javascript:, data:, vbscript:, etc.
 *
 * @param url - The URL string to validate
 * @returns true if the URL is valid and safe, false otherwise
 */
export function isValidUrl(url: string): boolean {
  try {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return false;

    const parsed = new URL(trimmedUrl);

    // Whitelist safe protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];

    return allowedProtocols.includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Gets a user-friendly error message for invalid URLs
 */
export function getUrlValidationError(url: string): string {
  try {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      return "Please enter a URL";
    }

    const parsed = new URL(trimmedUrl);

    if (!['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return `Invalid protocol "${parsed.protocol}". Please use http:// or https://`;
    }

    return "Invalid URL";
  } catch {
    return "Please enter a valid URL (e.g., https://example.com)";
  }
}
