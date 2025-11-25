/**
 * Parse a string into an integer, returning `null` for `null`/`undefined`
 * or invalid values.
 *
 * @param value - The string to parse
 * @returns The parsed integer, or `null`
 */
export function parseNullableInt(
  value: string | null | undefined,
): number | null {
  if (value == null) {
    return null;
  } else {
    const result = parseInt(value, 10);

    if (Number.isNaN(result)) {
      return null;
    }

    return result;
  }
}
