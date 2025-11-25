import type { CSVCell, CreateCSVStreamOptions } from './types';

import { serializeCSVRow } from './serializeCSVRow';

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
