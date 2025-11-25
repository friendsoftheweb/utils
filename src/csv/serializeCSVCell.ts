import type { CSVCell, CreateCSVStreamOptions } from './types';

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
  const numberFormat = options.numberFormat ?? DEFAULT_NUMBER_FORMAT;
  const dateFormat = options.dateFormat ?? DEFAULT_DATE_FORMAT;

  if (typeof cell === 'number') {
    return numberFormat.format(cell);
  }

  if (typeof cell === 'string') {
    cell = cell.replaceAll(/"+/g, '""');

    if (/("|,|\n)/.test(cell)) {
      cell = `"${cell}"`;
    }
  }

  if (typeof cell === 'boolean') {
    return cell ? 'true' : 'false';
  }

  if (cell instanceof Date) {
    return `"${dateFormat.format(cell)}"`;
  }

  return cell ?? '';
}
