/**
 * NexusOps Financial Formatting Utilities
 * 
 * High-precision, locale-aware formatting for enterprise treasury data.
 * Includes math interpolation helpers specifically designed to drive
 * buttery-smooth Framer Motion UI animations and ticker transitions.
 */

const formatterCache = new Map<string, Intl.NumberFormat>();
const rtfCache = new Map<string, Intl.RelativeTimeFormat>();

function getFormatter(
  locale: string,
  options: Intl.NumberFormatOptions
): Intl.NumberFormat {
  const key = `${locale}-${JSON.stringify(options)}`;
  if (!formatterCache.has(key)) {
    formatterCache.set(key, new Intl.NumberFormat(locale, options));
  }
  return formatterCache.get(key)!;
}

function getRelativeTimeFormatter(
  locale: string,
  options: Intl.RelativeTimeFormatOptions
): Intl.RelativeTimeFormat {
  const key = `${locale}-${JSON.stringify(options)}`;
  if (!rtfCache.has(key)) {
    rtfCache.set(key, new Intl.RelativeTimeFormat(locale, options));
  }
  return rtfCache.get(key)!;
}

export interface FormatCurrencyOptions {
  locale?: string;
  currency?: string;
  compact?: boolean;
  showSign?: boolean;
  maxDecimals?: number;
}

/**
 * Formats standard currency values.
 * Optimized for high-frequency re-renders via instance caching.
 */
export function formatCurrency(
  value: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    locale = "en-US",
    currency = "USD",
    compact = false,
    showSign = false,
    maxDecimals = 2,
  } = options;

  const formatter = getFormatter(locale, {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    signDisplay: showSign ? "exceptZero" : "auto",
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: maxDecimals,
  });

  return formatter.format(value);
}

/**
 * Formats large financial figures into compact enterprise notation.
 * e.g., 4280000000 -> "$4.28B"
 */
export function formatLargeNumber(
  value: number,
  options: Omit<FormatCurrencyOptions, "compact"> = {}
): string {
  const { locale = "en-US", currency = "USD", showSign = false, maxDecimals = 2 } = options;

  const formatter = getFormatter(locale, {
    style: "currency",
    currency,
    notation: "compact",
    signDisplay: showSign ? "exceptZero" : "auto",
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: maxDecimals > 0 ? 1 : 0,
  });

  return formatter.format(value);
}

/**
 * Formats standard numbers with thousand separators.
 */
export function formatNumber(
  value: number,
  locale: string = "en-US",
  maxDecimals: number = 0
): string {
  const formatter = getFormatter(locale, {
    notation: "standard",
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: maxDecimals,
  });

  return formatter.format(value);
}

/**
 * Formats percentage values with explicit signs and precision.
 * e.g., 0.042 -> "+4.20%"
 */
export function formatPercentage(
  value: number,
  options: { locale?: string; maxDecimals?: number; multiplyBy100?: boolean } = {}
): string {
  const { locale = "en-US", maxDecimals = 2, multiplyBy100 = true } = options;
  
  const adjustedValue = multiplyBy100 ? value * 100 : value;

  const formatter = getFormatter(locale, {
    style: "percent",
    signDisplay: "exceptZero",
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: maxDecimals,
  });

  return formatter.format(multiplyBy100 ? value : adjustedValue / 100);
}

/**
 * Formats basis points (bps) commonly used in interest rates and spreads.
 * e.g., 1.245 -> "+124.5 bps"
 */
export function formatBasisPoints(
  value: number,
  locale: string = "en-US"
): string {
  const bps = value * 10000;
  const formatter = getFormatter(locale, {
    signDisplay: "exceptZero",
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  });

  return `${formatter.format(bps)} bps`;
}

/**
 * Generates human-readable relative time strings for activity feeds.
 * e.g., "2 minutes ago", "just now"
 */
export function formatRelativeTime(
  date: Date | number,
  options: { locale?: string; now?: Date } = {}
): string {
  const { locale = "en-US", now = new Date() } = options;
  const timestamp = date instanceof Date ? date.getTime() : date;
  const diff = (timestamp - now.getTime()) / 1000;

  const rtf = getRelativeTimeFormatter(locale, { numeric: "auto" });

  const absDiff = Math.abs(diff);

  if (absDiff < 60) {
    return "just now";
  } else if (absDiff < 3600) {
    return rtf.format(Math.round(diff / 60), "minute");
  } else if (absDiff < 86400) {
    return rtf.format(Math.round(diff / 3600), "hour");
  } else if (absDiff < 2592000) {
    return rtf.format(Math.round(diff / 86400), "day");
  } else if (absDiff < 31536000) {
    return rtf.format(Math.round(diff / 2592000), "month");
  } else {
    return rtf.format(Math.round(diff / 31536000), "year");
  }
}

// ==========================================
// TACTILE UI MATH UTILITIES
// ==========================================

/**
 * Linear interpolation between two values.
 * Crucial for driving custom Framer Motion `useTransform` pipelines.
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

/**
 * Clamps a value between a minimum and maximum bound.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps a value from one range to another.
 * Useful for converting scroll progress (0-1) to CSS properties (e.g., opacity, blur, Y-axis).
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
}

/**
 * Generates a smooth easing curve array for Framer Motion keyframes.
 * Creates a "luxury" ease-out-expo feel for premium dashboard entrances.
 */
export function generateEaseCurve(
  steps: number = 60,
  easing: (t: number) => number = (t) => 1 - Math.pow(1 - t, 4)
): number[] {
  const curve: number[] = [];
  for (let i = 0; i <= steps; i++) {
    curve.push(easing(i / steps));
  }
  return curve;
}