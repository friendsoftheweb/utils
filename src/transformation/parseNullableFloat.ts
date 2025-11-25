/**
 * Parse a string into a float, returning `null` for `null`/`undefined`
 * or invalid values.
 *
 * @param value - The string to parse
 * @returns The parsed float, or `null`
 */
export function parseNullableFloat(
  value: string | null | undefined,
): number | null {
  if (value == null) {
    return null;
  } else {
    const result = parseFloat(value);

    if (Number.isNaN(result)) {
      return null;
    }

    return result;
  }
}
