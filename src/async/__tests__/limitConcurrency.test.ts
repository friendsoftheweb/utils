import { limitConcurrency } from '../limitConcurrency';

describe('limitConcurrency', () => {
  describe('basic functionality', () => {
    it('returns the result of the wrapped function', async () => {
      const fn = async (x: number) => x * 2;
      const limited = limitConcurrency(fn, 2);

      const result = await limited(5);
      expect(result).toBe(10);
    });

    it('passes arguments correctly to the wrapped function', async () => {
      const fn = async (a: number, b: string, c: boolean) => ({ a, b, c });
      const limited = limitConcurrency(fn, 2);

      const result = await limited(42, 'hello', true);
      expect(result).toEqual({ a: 42, b: 'hello', c: true });
    });

    it('preserves the return type', async () => {
      const fn = async () => ({ name: 'test', value: 123 });
      const limited = limitConcurrency(fn, 1);

      const result = await limited();
      expect(result).toEqual({ name: 'test', value: 123 });
    });
  });

  describe('concurrency limiting', () => {
    it('limits concurrent executions to maxConcurrency', async () => {
      let currentConcurrency = 0;
      let maxObservedConcurrency = 0;

      const fn = async () => {
        currentConcurrency++;
        maxObservedConcurrency = Math.max(
          maxObservedConcurrency,
          currentConcurrency,
        );

        await new Promise((resolve) => setTimeout(resolve, 50));

        currentConcurrency--;
      };

      const limited = limitConcurrency(fn, 2);

      await Promise.all([
        limited(),
        limited(),
        limited(),
        limited(),
        limited(),
      ]);

      expect(maxObservedConcurrency).toBe(2);
    });

    it('allows full concurrency up to the limit', async () => {
      let currentConcurrency = 0;
      let maxObservedConcurrency = 0;

      const fn = async () => {
        currentConcurrency++;
        maxObservedConcurrency = Math.max(
          maxObservedConcurrency,
          currentConcurrency,
        );

        await new Promise((resolve) => setTimeout(resolve, 10));

        currentConcurrency--;
      };

      const limited = limitConcurrency(fn, 5);

      await Promise.all([limited(), limited(), limited()]);

      expect(maxObservedConcurrency).toBe(3);
    });

    it('processes tasks in order when concurrency is 1', async () => {
      const executionOrder: number[] = [];

      const fn = async (id: number) => {
        executionOrder.push(id);
        await new Promise((resolve) => setTimeout(resolve, 10));
      };

      const limited = limitConcurrency(fn, 1);

      await Promise.all([limited(1), limited(2), limited(3)]);

      expect(executionOrder).toEqual([1, 2, 3]);
    });
  });

  describe('error handling', () => {
    it('propagates errors from the wrapped function', async () => {
      const error = new Error('Test error');
      const fn = async () => {
        throw error;
      };
      const limited = limitConcurrency(fn, 2);

      await expect(limited()).rejects.toThrow('Test error');
    });

    it('releases the semaphore slot when an error occurs', async () => {
      let currentConcurrency = 0;
      let maxObservedConcurrency = 0;

      const fn = async (shouldFail: boolean) => {
        currentConcurrency++;
        maxObservedConcurrency = Math.max(
          maxObservedConcurrency,
          currentConcurrency,
        );

        await new Promise((resolve) => setTimeout(resolve, 20));

        currentConcurrency--;

        if (shouldFail) {
          throw new Error('Intentional failure');
        }

        return 'success';
      };

      const limited = limitConcurrency(fn, 1);

      const results = await Promise.allSettled([
        limited(true),
        limited(false),
        limited(false),
      ]);

      expect(results[0].status).toBe('rejected');
      expect(results[1].status).toBe('fulfilled');
      expect(results[2].status).toBe('fulfilled');
      expect(maxObservedConcurrency).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('handles maxConcurrency of 0 (no limiting)', async () => {
      let currentConcurrency = 0;
      let maxObservedConcurrency = 0;

      const fn = async () => {
        currentConcurrency++;
        maxObservedConcurrency = Math.max(
          maxObservedConcurrency,
          currentConcurrency,
        );

        await new Promise((resolve) => setTimeout(resolve, 10));

        currentConcurrency--;
      };

      const limited = limitConcurrency(fn, 0);

      await Promise.all([
        limited(),
        limited(),
        limited(),
        limited(),
        limited(),
      ]);

      expect(maxObservedConcurrency).toBe(5);
    });

    it('handles functions with no arguments', async () => {
      const fn = async () => 'no args';
      const limited = limitConcurrency(fn, 1);

      const result = await limited();
      expect(result).toBe('no args');
    });
  });

  describe('multiple wrapped functions', () => {
    it('each wrapped function has independent concurrency limits', async () => {
      let concurrency1 = 0;
      let concurrency2 = 0;
      let maxConcurrency1 = 0;
      let maxConcurrency2 = 0;

      const fn1 = async () => {
        concurrency1++;
        maxConcurrency1 = Math.max(maxConcurrency1, concurrency1);
        await new Promise((resolve) => setTimeout(resolve, 30));
        concurrency1--;
      };

      const fn2 = async () => {
        concurrency2++;
        maxConcurrency2 = Math.max(maxConcurrency2, concurrency2);
        await new Promise((resolve) => setTimeout(resolve, 30));
        concurrency2--;
      };

      const limited1 = limitConcurrency(fn1, 1);
      const limited2 = limitConcurrency(fn2, 3);

      await Promise.all([
        limited1(),
        limited1(),
        limited1(),
        limited2(),
        limited2(),
        limited2(),
      ]);

      expect(maxConcurrency1).toBe(1);
      expect(maxConcurrency2).toBe(3);
    });
  });
});
