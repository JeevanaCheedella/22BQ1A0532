import { logger } from '../../../logging-middleware';

/**
 * Validates a URL string.
 * @param url The URL to validate.
 * @returns An error message if invalid, otherwise undefined.
 */
export const validateUrl = (url: string): string | undefined => {
  if (!url.trim()) {
    return 'URL is required';
  }
  try {
    new URL(url);
    return undefined;
  } catch {
    logger.warn('Invalid URL format provided', { url });
    return 'Please enter a valid URL (including http:// or https://)';
  }
};

/**
 * Validates the validity period in minutes.
 * @param minutes The validity period.
 * @returns An error message if invalid, otherwise undefined.
 */
export const validateValidityMinutes = (minutes: number): string | undefined => {
  if (!Number.isInteger(minutes) || minutes <= 0) {
    logger.warn('Invalid validity period provided', { minutes });
    return 'Validity period must be a positive integer';
  }
  if (minutes > 10080) { // 1 week
    return 'Validity period cannot exceed 1 week (10080 minutes)';
  }
  return undefined;
};

/**
 * Validates a custom shortcode.
 * @param shortcode The shortcode to validate.
 * @returns An error message if invalid, otherwise undefined.
 */
export const validateShortcode = (shortcode: string): string | undefined => {
  if (!shortcode.trim()) {
    return undefined; // Empty shortcode is allowed (will be auto-generated)
  }
  const trimmedCode = shortcode.trim();
  if (trimmedCode.length < 3) {
    return 'Shortcode must be at least 3 characters long';
  }
  if (trimmedCode.length > 20) {
    return 'Shortcode cannot exceed 20 characters';
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedCode)) {
    logger.warn('Invalid shortcode format provided', { shortcode: trimmedCode });
    return 'Shortcode can only contain letters, numbers, underscores, and hyphens';
  }
  return undefined;
};

/**
 * Generates a random 6-character alphanumeric shortcode.
 * @returns The generated shortcode.
 */
export const generateShortcode = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  logger.debug('Generated shortcode', { shortcode: result });
  return result;
};