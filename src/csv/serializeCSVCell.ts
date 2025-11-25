import type { CSVCell, CreateCSVStreamOptions } from './types';

const DEFAULT_BOOLEAN_FORMAT = {
  format(value: boolean): string {
    return value ? 'true' : 'false';
  },
};

const DEFAULT_NUMBER_FORMAT = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
  useGrouping: false,
});

const DEFAULT_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/**
 * Serializes a single CSV cell according to the provided options.
 *
 * @param cell - The cell value to serialize.
 * @param options - Options for formatting numbers and dates.
 * @returns The serialized CSV cell as a string.
 */
export function serializeCSVCell(
  cell: CSVCell,
  options: CreateCSVStreamOptions = {},
): string {
  const booleanFormat = options.booleanFormat ?? DEFAULT_BOOLEAN_FORMAT;
  const numberFormat = options.numberFormat ?? DEFAULT_NUMBER_FORMAT;
  const dateFormat = options.dateFormat ?? DEFAULT_DATE_FORMAT;

  if (typeof cell === 'number') {
    if (Number.isNaN(cell)) {
      return '';
    } else {
      return escapeCSVCell(numberFormat.format(cell));
    }
  }

  if (typeof cell === 'string') {
    cell = escapeCSVCell(cell);
  }

  if (typeof cell === 'boolean') {
    return escapeCSVCell(booleanFormat.format(cell));
  }

  if (cell instanceof Date) {
    return escapeCSVCell(dateFormat.format(cell));
  }

  return cell ?? '';
}

function escapeCSVCell(cell: string): string {
  let escaped = cell.replaceAll('"', '""');

  if (/("|,|\n)/.test(escaped)) {
    escaped = `"${escaped}"`;
  }

  return escaped;
}
