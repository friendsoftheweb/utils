import { presence } from '../transformation/presence';

/**
 * Determines whether a value is neither `null` nor `undefined`.
 *
 * @param value - The value to test for presence
 * @returns `true` if `value` is not `null` or `undefined`, `false` otherwise
 */
export function isPresent<T>(value: T): value is NonNullable<T> {
  return presence(value) != null;
}
