import { assert } from '../assert';
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

  assert(maxConcurrency >= 1, 'maxConcurrency must be at least 1');

  const semaphore = new Semaphore(maxConcurrency);
  const iterator = getElements();
  const inFlight = new Set<Promise<void>>();

  let done = false;
  let hasError = false;
  let firstError: unknown;

  while (!done) {
    const release = await semaphore.acquire();

    if (done) {
      release();

      break;
    }

    const task = (async () => {
      try {
        const result = await iterator.next();

        if (result.done) {
          done = true;
        } else {
          await callback(result.value);
        }
      } catch (error) {
        done = true;

        if (!hasError) {
          hasError = true;
          firstError = error;
        }
      } finally {
        release();
      }
    })();

    inFlight.add(task);

    task.finally(() => {
      inFlight.delete(task);
    });
  }

  await Promise.allSettled(inFlight);

  if (hasError) {
    throw firstError;
  }
}
