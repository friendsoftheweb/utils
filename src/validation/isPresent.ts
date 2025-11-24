import { presence } from '../transformation/presence';

/**
 * Type guard that determines whether a value is "present" based on type-specific checks.
 *
 * Returns `false` for null/undefined, empty strings, invalid numbers (NaN/Infinity),
 * empty arrays, empty plain objects, and empty Sets/Maps.
 *
 * @param value - The value to test for presence
 * @returns `true` if `value` is present according to type-specific rules, `false` otherwise
 */
export function isPresent<T>(value: T): value is NonNullable<T> {
  return presence(value) != null;
}
