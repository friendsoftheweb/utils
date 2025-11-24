import { isPresentNumber, isPresentString } from '../validation';

/**
 * Return the input when it is considered "present", otherwise `undefined`.
 *
 * A value is considered present when it is not `null`/`undefined` and:
 * - a string that passes `isPresentString`,
 * - a number that passes `isPresentNumber`,
 * - a non-empty array,
 * - a plain object with at least one own enumerable key,
 * - a `Set` or `Map` with size > 0,
 * - or any other value (returned as-is).
 *
 * @param value - The value to evaluate for presence
 * @returns The original `value` if it is present, `undefined` otherwise
 */
export function presence<T>(value: T): NonNullable<T> | undefined {
  if (value == null) {
    return;
  }

  if (typeof value === 'string') {
    return isPresentString(value) ? value : undefined;
  }

  if (typeof value === 'number') {
    return isPresentNumber(value) ? value : undefined;
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value : undefined;
  }

  if (
    typeof value === 'object' &&
    Object.getPrototypeOf(value) === Object.prototype
  ) {
    return Object.keys(value).length > 0 ? value : undefined;
  }

  if (value instanceof Set || value instanceof Map) {
    return value.size > 0 ? value : undefined;
  }

  return value;
}
