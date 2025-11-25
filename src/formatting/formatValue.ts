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

interface Options {
  locales?: Intl.LocalesArgument;
  abbreviate?: boolean;
  unit?: string | null;
  significantFigures?: number;
}

export function formatValue(value: number, options?: Options): string;
export function formatValue(value: null, options?: Options): null;
export function formatValue(
  value: number | null,
  options?: Options,
): string | null;

export function formatValue(value: null | number, options: Options = {}) {
  const {
    locales = 'en-US',
    abbreviate = false,
    unit,
    significantFigures = 1,
  } = options;

  const integerFormat = new Intl.NumberFormat(locales, {
    maximumFractionDigits: 0,
  });

  const decimalFormat = new Intl.NumberFormat(locales, {
    maximumFractionDigits: significantFigures,
  });

  if (typeof value === 'number') {
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

  return value;
}
