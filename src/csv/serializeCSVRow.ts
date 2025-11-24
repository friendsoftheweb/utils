import type { CSVCell, CreateCSVStreamOptions } from './types';

import { serializeCSVCell } from './serializeCSVCell';

export function serializeCSVRow(
  cells: CSVCell[],
  options: CreateCSVStreamOptions,
): string {
  return `${cells.map((cell) => serializeCSVCell(cell, options)).join(',')}\n`;
}
