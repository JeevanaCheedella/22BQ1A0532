/**
 * Represents a shortened URL and its metadata.
 */
export interface ShortenedURL {
  /** Unique ID for this shortened URL entry */
  id: string;
  /** The original long URL */
  originalUrl: string;
  /** The generated short URL */
  shortenedUrl: string;
  /** The unique shortcode for this URL */
  shortcode: string;
  /** Validity period in minutes */
  validityMinutes: number;
  /** Creation timestamp */
  createdAt: Date;
  /** Expiry timestamp */
  expiryAt: Date;
  /** Total number of clicks */
  clickCount: number;
  /** Detailed click logs */
  clicks: ClickDetail[];
}

/**
 * Represents a single click event on a shortened URL.
 */
export interface ClickDetail {
  /** Unique ID for the click event */
  id: string;
  /** Timestamp of the click */
  timestamp: Date;
  /** Referrer/source of the click */
  referrer: string;
  /** Coarse-grained location (e.g., country) */
  location: string;
  /** User agent string */
  userAgent: string;
}

/**
 * Represents the state of a URL input form.
 */
export interface URLInput {
  /** Unique ID for this input row */
  id: string;
  /** The original URL entered by the user */
  originalUrl: string;
  /** Validity period in minutes */
  validityMinutes: number;
  /** Optional custom shortcode */
  customShortcode: string;
  /** Validation errors for each field */
  errors: {
    originalUrl?: string;
    validityMinutes?: string;
    customShortcode?: string;
  };
}