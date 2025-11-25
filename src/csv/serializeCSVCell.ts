import type { CSVCell, CreateCSVStreamOptions } from './types';

const DEFAULT_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export function serializeCSVCell(
  cell: CSVCell,
  options: CreateCSVStreamOptions = {},
): string {
  const dateFormat = options.dateFormat ?? DEFAULT_DATE_FORMAT;

  if (typeof cell === 'number') {
    return cell.toString();
  }

  if (typeof cell === 'string') {
    cell = cell.replaceAll(/"+/g, '""');

    if (/("|,|\n)/.test(cell)) {
      cell = `"${cell.replaceAll('\n', '\\n')}"`;
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
