import type { CSVCell, CreateCSVStreamOptions } from './types';

import { serializeCSVRow } from './serializeCSVRow';

/**
 * Creates a ReadableStream that generates CSV data from an async generator of
 * rows.
 *
 * _**NOTE:** Numbers are formatted using the provided numberFormat option or a
 * default format that does not use grouping and limits maximum fraction digits
 * to 3._
 *
 * @param getRows - A function that returns an async generator yielding arrays
 * of CSV cells.
 * @param options - Options for formatting numbers, dates, and error reporting.
 * @returns A ReadableStream that outputs CSV data as strings.
 */
export function createCSVStream(
  getRows: () => AsyncGenerator<CSVCell[], void, CSVCell[]>,
  options: CreateCSVStreamOptions = {},
): ReadableStream<string> {
  const rowGenerator = getRows();

  const {
    reportError = (error) => {
      console.error(error);
    },
  } = options;

  return new ReadableStream<string>({
    async start(controller) {
      controller.enqueue('\uFEFF'); // BOM for UTF-8
    },

    async pull(controller) {
      try {
        const { value, done } = await rowGenerator.next();

        if (done) {
          controller.close();
        } else {
          controller.enqueue(serializeCSVRow(value, options));
        }
      } catch (error) {
        reportError(error);

        controller.error(error);
      }
    },
  });
}
