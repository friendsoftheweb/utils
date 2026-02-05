import { Semaphore } from './Semaphore';

/**
 * Wraps an async function to limit the number of concurrent executions.
 *
 * This is useful for rate-limiting API calls, controlling resource usage,
 * or preventing overload when processing many items in parallel.
 *
 * @param fn - The async function to wrap
 * @param maxConcurrency - Maximum number of concurrent executions allowed.
 *   If set to 0 or less, no limit is applied.
 * @returns A wrapped function with the same signature that enforces the
 *   concurrency limit. Calls beyond the limit will wait until a slot is available.
 *
 * @example Basic usage
 * ```ts
 * const limitedFetch = limitConcurrency(fetch, 5);
 *
 * // Only 5 requests will execute at a time
 * const results = await Promise.all(
 *   urls.map((url) => limitedFetch(url))
 * );
 * ```
 *
 * @example With arguments
 * ```ts
 * const processItem = limitConcurrency(
 *   async (id: string, options: Options) => {
 *     const result = await expensiveOperation(id, options);
 *     return result;
 *   },
 *   3
 * );
 *
 * // Process items with max 3 concurrent operations
 * await Promise.all(items.map((item) => processItem(item.id, item.options)));
 * ```
 *
 * @example Error handling
 * ```ts
 * const limited = limitConcurrency(riskyOperation, 2);
 *
 * // Errors propagate normally; the concurrency slot is released
 * // even if the function throws
 * try {
 *   await limited();
 * } catch (error) {
 *   // Handle error
 * }
 * ```
 */
export function limitConcurrency<TReturn, TArgs extends unknown[]>(
  fn: (...args: TArgs) => Promise<TReturn>,
  maxConcurrency: number,
): (...args: TArgs) => Promise<TReturn> {
  const semaphore = new Semaphore(maxConcurrency);

  return async (...args: TArgs) => {
    const release = await semaphore.acquire();

    try {
      return await fn(...args);
    } finally {
      release();
    }
  };
}
