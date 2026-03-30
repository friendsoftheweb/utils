import { Semaphore } from './Semaphore';

/**
 * Iterates over an async generator and invokes a callback for each element,
 * processing up to `maxConcurrency` elements concurrently.
 *
 * @param getElements - A factory function returning an async generator of elements to process.
 * @param callback - An async function called for each element.
 * @param options.maxConcurrency - Maximum number of concurrent callback invocations. Defaults to 2.
 */
export async function forEachConcurrent<T>(
  getElements: () => AsyncGenerator<T, void, unknown>,
  callback: (element: T) => Promise<void>,
  options: { maxConcurrency?: number } = {},
): Promise<void> {
  const { maxConcurrency = 2 } = options;

  const semaphore = new Semaphore(maxConcurrency);
  const iterator = getElements();

  let done = false;

  while (!done) {
    const release = await semaphore.acquire();

    (async () => {
      try {
        const result = await iterator.next();

        if (result.done) {
          done = true;
        } else {
          await callback(result.value);
        }
      } finally {
        release();
      }
    })();
  }
}
