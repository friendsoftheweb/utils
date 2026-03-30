import { forEachConcurrent } from '../forEachConcurrent';

async function* fromArray<T>(items: T[]): AsyncGenerator<T, void, unknown> {
  for (const item of items) {
    yield item;
  }
}

describe('forEachConcurrent', () => {
  it('calls the callback for each element', async () => {
    const processed: number[] = [];

    await forEachConcurrent(
      () => fromArray([1, 2, 3]),
      async (n) => {
        processed.push(n);
      },
      { maxConcurrency: 1 },
    );

    expect(processed).toEqual([1, 2, 3]);
  });

  it('handles an empty generator', async () => {
    const processed: number[] = [];

    await forEachConcurrent(
      () => fromArray<number>([]),
      async (n) => {
        processed.push(n);
      },
    );

    expect(processed).toHaveLength(0);
  });

  it('limits concurrent executions to maxConcurrency', async () => {
    let currentConcurrency = 0;
    let maxObservedConcurrency = 0;

    await forEachConcurrent(
      () => fromArray([1, 2, 3, 4, 5]),
      async () => {
        currentConcurrency++;
        maxObservedConcurrency = Math.max(
          maxObservedConcurrency,
          currentConcurrency,
        );
        await new Promise((resolve) => setTimeout(resolve, 20));
        currentConcurrency--;
      },
      { maxConcurrency: 2 },
    );

    expect(maxObservedConcurrency).toBeGreaterThan(1);
    expect(maxObservedConcurrency).toBeLessThanOrEqual(2);
  });

  it('defaults to a maxConcurrency of 2', async () => {
    let currentConcurrency = 0;
    let maxObservedConcurrency = 0;

    await forEachConcurrent(
      () => fromArray([1, 2, 3, 4, 5]),
      async () => {
        currentConcurrency++;
        maxObservedConcurrency = Math.max(
          maxObservedConcurrency,
          currentConcurrency,
        );
        await new Promise((resolve) => setTimeout(resolve, 20));
        currentConcurrency--;
      },
    );

    expect(maxObservedConcurrency).toBeGreaterThan(1);
    expect(maxObservedConcurrency).toBeLessThanOrEqual(2);
  });
});
