interface Magnitude {
  multiple: number;
  abbreviation: string;
}

const MAGNITUDES: Magnitude[] = [
  {
    multiple: 1_000_000_000_000,
    abbreviation: 'T',
  },
  {
    multiple: 1_000_000_000,
    abbreviation: 'B',
  },
  {
    multiple: 1_000_000,
    abbreviation: 'M',
  },
  {
    multiple: 1_000,
    abbreviation: 'K',
  },
];

export interface FormatValueOptions {
  locales?: Intl.LocalesArgument;
  abbreviate?: boolean;
  unit?: string | null;
  maximumFractionDigits?: number;
}

export function formatValue(
  value: number,
  options?: FormatValueOptions,
): string;
export function formatValue(value: null, options?: FormatValueOptions): null;
export function formatValue(
  value: number | null,
  options?: FormatValueOptions,
): string | null;

/**
 * Formats a numeric value with optional order-of-magnitude abbreviation and
 * unit.
 *
 * @param value - The numeric value to format, or null.
 * @param options - Formatting options.
 * @returns The formatted value as a string, or null if the input value is null.
 */
export function formatValue(
  value: null | number,
  options: FormatValueOptions = {},
) {
  const {
    locales = 'en-US',
    abbreviate = false,
    unit,
    maximumFractionDigits = 1,
  } = options;

  const integerFormat = new Intl.NumberFormat(locales, {
    maximumFractionDigits: 0,
  });

  const decimalFormat = new Intl.NumberFormat(locales, {
    maximumFractionDigits,
  });

  if (value == null) {
    return null;
  }

  if (Number.isNaN(value)) {
    throw new Error('Cannot format NaN value');
  }

  let formattedValue: string;

  if (!Number.isFinite(value)) {
    formattedValue = integerFormat.format(value);
  } else if (abbreviate) {
    const magnitude = MAGNITUDES.find(
      ({ multiple }) => Math.abs(value / multiple) >= 1,
    );

    formattedValue = decimalFormat.format(
      value / (magnitude != null ? magnitude.multiple : 1),
    );

    if (magnitude != null) {
      formattedValue += magnitude.abbreviation;
    }
  } else if (unit != null && /^%/.test(unit)) {
    formattedValue = integerFormat.format(value);
  } else {
    formattedValue = decimalFormat.format(value);
  }

  if (unit == null) {
    return formattedValue;
  }

  if (/^%/.test(unit)) {
    return `${formattedValue}${unit}`;
  }

  return `${formattedValue} ${unit}`;
}

export function createFormatValue(defaultOptions: FormatValueOptions = {}) {
  return (value: number | null, options: FormatValueOptions = {}) =>
    formatValue(value, { ...defaultOptions, ...options });
}
