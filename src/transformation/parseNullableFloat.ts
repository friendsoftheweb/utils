export function parseNullableFloat(value: string): number;

export function parseNullableFloat(value: null | undefined): undefined;

export function parseNullableFloat(
  value: string | null | undefined,
): number | undefined;

export function parseNullableFloat(
  value: string | null | undefined,
): number | undefined {
  if (value == null) {
    return undefined;
  } else {
    const result = parseFloat(value);

    if (Number.isNaN(result)) {
      return undefined;
    }

    return result;
  }
}
