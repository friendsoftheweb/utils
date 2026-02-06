/**
 * A primitive for limiting the concurrency of asynchronous tasks.
 *
 * @example Limits concurrency of `expensiveTask()` to 5
 *
 * const semaphore = new Semaphore(5);
 *
 * async function expensiveTask() {
 *   const release = await semaphore.acquire();
 *
 *   try {
 *     // Do expensive work
 *   } finally {
 *     release();
 *   }
 * };
 */
export class Semaphore {
  private readonly maxConcurrency: number;
  private concurrency: number;
  private queue: Array<() => void>;

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency;
    this.concurrency = 0;
    this.queue = [];
  }

  acquire(): Promise<() => void> {
    if (this.maxConcurrency <= 0) {
      return Promise.resolve(() => {});
    }

    return new Promise((resolve) => {
      this.queue.push(() => {
        let released = false;

        resolve(() => {
          if (!released) {
            released = true;
            this.concurrency--;
            this.next();
          }
        });
      });

      queueMicrotask(() => {
        this.next();
      });
    });
  }

  next() {
    if (this.concurrency < this.maxConcurrency && this.queue.length > 0) {
      const task = this.queue.shift();

      if (task != null) {
        this.concurrency++;
        task();
      }
    }
  }
}
