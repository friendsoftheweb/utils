export function parseNullableInt(value: string): number;

export function parseNullableInt(value: null | undefined): undefined;

export function parseNullableInt(
  value: string | null | undefined,
): number | undefined;

export function parseNullableInt(
  value: string | null | undefined,
): number | undefined {
  if (value == null) {
    return undefined;
  } else {
    const result = parseInt(value, 10);

    if (Number.isNaN(result)) {
      return undefined;
    }

    return result;
  }
}
