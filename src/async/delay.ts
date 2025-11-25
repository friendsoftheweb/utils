/**
 * Delay for a specified number of milliseconds.
 *
 * @param delayInMilliseconds - Number of milliseconds to wait before the delay completes
 * @returns A promise that resolves with no value when the timeout elapses
 */
export function delay(delayInMilliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayInMilliseconds);
  });
}