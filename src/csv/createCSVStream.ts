import type { CSVCell, CreateCSVStreamOptions } from './types';

import { serializeCSVRow } from './serializeCSVRow';

/**
 * Create a ReadableStream that produces CSV text from an async generator of rows.
 *
 * The stream begins with a UTF-8 byte order mark (BOM). Numbers are formatted using
 * the provided `numberFormat` option or a default that disables grouping and limits
 * fractional digits to a maximum of 3.
 *
 * @param getRows - Function that returns an AsyncGenerator yielding arrays of CSV cells.
 * @param options - Formatting and error-reporting options. If `reportError` is not provided,
 *   errors are logged to the console.
 * @returns A ReadableStream that outputs serialized CSV rows as strings (the first chunk is the BOM).
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