import type { CSVCell } from '../types';

import { createCSVStream } from '../createCSVStream';

// Helper function to read all chunks from a ReadableStream
async function streamToString(stream: ReadableStream<string>): Promise<string> {
  const reader = stream.getReader();
  let result = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += value;
    }
  } finally {
    reader.releaseLock();
  }

  return result;
}

// Helper function to read chunks one by one
async function streamToChunks(
  stream: ReadableStream<string>,
): Promise<string[]> {
  const reader = stream.getReader();
  const chunks: string[] = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  return chunks;
}

describe('createCSVStream', () => {
  describe('basic functionality', () => {
    it('creates a ReadableStream from async generator', async () => {
      async function* getRows() {
        yield ['Name', 'Age'];
        yield ['John', 30];
        yield ['Jane', 25];
      }

      const stream = createCSVStream(getRows);
      expect(stream).toBeInstanceOf(ReadableStream);

      const result = await streamToString(stream);
      expect(result).toBe('Name,Age\nJohn,30\nJane,25\n');
    });

    it('handles empty generator', async () => {
      async function* getRows(): AsyncGenerator<CSVCell[]> {
        return;
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);
      expect(result).toBe('');
    });

    it('handles single row', async () => {
      async function* getRows() {
        yield ['single', 'row'];
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);
      expect(result).toBe('single,row\n');
    });

    it('handles empty rows', async () => {
      async function* getRows() {
        yield [];
        yield ['data'];
        yield [];
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);
      expect(result).toBe('\ndata\n\n');
    });
  });

  describe('data type handling', () => {
    xit('handles various CSV cell types', async () => {
      async function* getRows() {
        yield ['String', 123, true, false, null, undefined];
        yield ['Text with,comma', -45.67, new Date('2024-01-01')];
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);

      const lines = result.split('\n').filter((line) => line);

      expect(lines).toHaveLength(2);
      expect(lines[0]).toMatch(/String,123,true,false,,$/);
      expect(lines[1]).toMatch(
        /\"Text with,comma\",-45\.67,\"January 1, 2024\"$/,
      );
    });

    it('handles strings with special characters', async () => {
      async function* getRows() {
        yield ['Normal text'];
        yield ['Text with \"quotes\"'];
        yield ['Text\nwith\nnewlines'];
        yield ['Text, with, commas'];
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);

      const lines = result.split('\n').filter((line) => line);

      expect(lines[0]).toBe('Normal text');
      expect(lines[1]).toBe('\"Text with \"\"quotes\"\"\"');
      expect(lines[2]).toBe('\"Text');
      expect(lines[3]).toBe('with');
      expect(lines[4]).toBe('newlines\"');
      expect(lines[5]).toBe('\"Text, with, commas\"');
    });

    xit('handles dates with custom format', async () => {
      const customDateFormat = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      async function* getRows() {
        yield [new Date('2024-01-15'), new Date('2024-12-25')];
      }

      const stream = createCSVStream(getRows, { dateFormat: customDateFormat });
      const result = await streamToString(stream);

      expect(result).toBe('\"15/01/2024\",\"25/12/2024\"\n');
    });
  });

  describe('streaming behavior', () => {
    it('streams data incrementally', async () => {
      let yieldCount = 0;

      async function* getRows() {
        yield ['row', ++yieldCount];
        yield ['row', ++yieldCount];
        yield ['row', ++yieldCount];
      }

      const stream = createCSVStream(getRows);
      const chunks = await streamToChunks(stream);

      expect(chunks).toHaveLength(3);
      expect(chunks[0]).toBe('row,1\n');
      expect(chunks[1]).toBe('row,2\n');
      expect(chunks[2]).toBe('row,3\n');
    });

    it('handles async delays in generator', async () => {
      async function* getRows() {
        yield ['immediate'];
        await new Promise((resolve) => setTimeout(resolve, 10));
        yield ['delayed'];
        await new Promise((resolve) => setTimeout(resolve, 5));
        yield ['final'];
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);

      expect(result).toBe('immediate\ndelayed\nfinal\n');
    });

    it('can be consumed by multiple readers sequentially', async () => {
      async function* getRows() {
        yield ['data', 1];
        yield ['data', 2];
      }

      const stream = createCSVStream(getRows);

      // First consumption
      const result1 = await streamToString(stream);
      expect(result1).toBe('data,1\ndata,2\n');

      // Second consumption should fail (stream already consumed)
      const reader = stream.getReader();
      const { done } = await reader.read();
      expect(done).toBe(true);
      reader.releaseLock();
    });
  });

  describe('error handling', () => {
    it('handles generator errors with default error reporting', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      async function* getRows(): AsyncGenerator<CSVCell[]> {
        yield ['first', 'row'];
        throw new Error('Generator error');
      }

      const stream = createCSVStream(getRows);
      const reader = stream.getReader();

      // First read should succeed
      const { value: firstValue, done: firstDone } = await reader.read();
      expect(firstDone).toBe(false);
      expect(firstValue).toBe('first,row\n');

      // Second read should throw
      await expect(reader.read()).rejects.toThrow('Generator error');

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Generator error',
        }),
      );

      consoleSpy.mockRestore();
      reader.releaseLock();
    });

    it('handles errors with custom error reporting', async () => {
      const customErrorHandler = jest.fn();

      async function* getRows(): AsyncGenerator<CSVCell[]> {
        yield ['data'];
        throw new Error('Custom error');
      }

      const stream = createCSVStream(getRows, {
        reportError: customErrorHandler,
      });
      const reader = stream.getReader();

      // Read first successful chunk
      await reader.read();

      // Read should fail and call custom error handler
      await expect(reader.read()).rejects.toThrow('Custom error');

      expect(customErrorHandler).toHaveBeenCalledTimes(1);
      expect(customErrorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Custom error',
        }),
      );

      reader.releaseLock();
    });

    it('handles error in first row', async () => {
      const errorHandler = jest.fn();

      async function* getRows(): AsyncGenerator<CSVCell[]> {
        throw new Error('Immediate error');
      }

      const stream = createCSVStream(getRows, { reportError: errorHandler });
      const reader = stream.getReader();

      await expect(reader.read()).rejects.toThrow('Immediate error');
      expect(errorHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Immediate error',
        }),
      );

      reader.releaseLock();
    });

    it('handles synchronous errors in generator', async () => {
      const errorHandler = jest.fn();

      async function* getRows(): AsyncGenerator<CSVCell[]> {
        yield ['good row'];
        JSON.parse('invalid json'); // Synchronous error
      }

      const stream = createCSVStream(getRows, { reportError: errorHandler });
      const reader = stream.getReader();

      // First read succeeds
      const { value } = await reader.read();
      expect(value).toBe('good row\n');

      // Second read fails
      await expect(reader.read()).rejects.toThrow();
      expect(errorHandler).toHaveBeenCalledWith(expect.any(SyntaxError));

      reader.releaseLock();
    });
  });

  describe('options handling', () => {
    it('works without options parameter', async () => {
      async function* getRows() {
        yield ['test'];
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);

      expect(result).toBe('test\n');
    });

    it('works with empty options object', async () => {
      async function* getRows() {
        yield ['test'];
      }

      const stream = createCSVStream(getRows, {});
      const result = await streamToString(stream);

      expect(result).toBe('test\n');
    });

    xit('passes options to serializeCSVRow', async () => {
      const customDateFormat = new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      async function* getRows(): AsyncGenerator<CSVCell[], void, CSVCell[]> {
        yield [new Date('2024-06-15')];
      }

      const stream = createCSVStream(getRows, { dateFormat: customDateFormat });
      const result = await streamToString(stream);

      expect(result).toBe('\"15.06.2024\"\n');
    });
  });

  describe('large data handling', () => {
    it('handles large number of rows efficiently', async () => {
      async function* getRows() {
        for (let i = 0; i < 1000; i++) {
          yield [`row${i}`, i, i % 2 === 0];
        }
      }

      const stream = createCSVStream(getRows);
      const chunks = await streamToChunks(stream);

      expect(chunks).toHaveLength(1000);
      expect(chunks[0]).toBe('row0,0,true\n');
      expect(chunks[999]).toBe('row999,999,false\n');
    });

    it('handles rows with many columns', async () => {
      async function* getRows() {
        const largeRow = Array.from({ length: 100 }, (_, i) => `col${i}`);
        yield largeRow;
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);

      const expectedRow =
        Array.from({ length: 100 }, (_, i) => `col${i}`).join(',') + '\n';
      expect(result).toBe(expectedRow);
    });

    it('handles memory efficiently with large strings', async () => {
      async function* getRows() {
        const largeString = 'x'.repeat(10000);
        yield [largeString];
        yield ['small'];
      }

      const stream = createCSVStream(getRows);
      const chunks = await streamToChunks(stream);

      expect(chunks).toHaveLength(2);
      expect(chunks[0]).toBe('x'.repeat(10000) + '\n');
      expect(chunks[1]).toBe('small\n');
    });
  });

  describe('real-world scenarios', () => {
    xit('handles typical user data export', async () => {
      async function* getRows() {
        yield ['ID', 'Name', 'Email', 'Created', 'Active'];
        yield [1, 'John Doe', 'john@example.com', new Date('2024-01-01'), true];
        yield [
          2,
          'Jane Smith',
          'jane@example.com',
          new Date('2024-01-02'),
          false,
        ];
        yield [
          3,
          'Bob Johnson',
          'bob@example.com',
          new Date('2024-01-03'),
          true,
        ];
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);

      const lines = result.split('\n').filter((line) => line);
      expect(lines).toHaveLength(4);
      expect(lines[0]).toBe('ID,Name,Email,Created,Active');
      expect(lines[1]).toMatch(
        /1,John Doe,john@example\.com,\"January 1, 2024\",true/,
      );
    });

    it('handles database-like data with nulls', async () => {
      async function* getRows() {
        yield ['ID', 'Name', 'OptionalField', 'Value'];
        yield [1, 'Present', 'data', 100];
        yield [2, 'Missing', null, 200];
        yield [3, 'Undefined', undefined, null];
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);

      const lines = result.split('\n').filter((line) => line);
      expect(lines[1]).toBe('1,Present,data,100');
      expect(lines[2]).toBe('2,Missing,,200');
      expect(lines[3]).toBe('3,Undefined,,');
    });

    it('handles async data fetching pattern', async () => {
      // Simulate async database fetching
      const mockFetch = (page: number) =>
        new Promise<Array<[number, string]>>((resolve) => {
          setTimeout(() => {
            if (page > 2) resolve([]);
            else
              resolve([
                [page * 2 - 1, `Item ${page * 2 - 1}`],
                [page * 2, `Item ${page * 2}`],
              ]);
          }, 10);
        });

      async function* getRows() {
        yield ['ID', 'Name']; // Header

        let page = 1;
        while (true) {
          const data = await mockFetch(page);
          if (data.length === 0) break;

          for (const row of data) {
            yield row;
          }
          page++;
        }
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);

      const lines = result.split('\n').filter((line) => line);
      expect(lines).toHaveLength(5); // Header + 4 data rows
      expect(lines[0]).toBe('ID,Name');
      expect(lines[1]).toBe('1,Item 1');
      expect(lines[4]).toBe('4,Item 4');
    });
  });

  describe('edge cases', () => {
    it('handles very frequent yielding', async () => {
      async function* getRows() {
        for (let i = 0; i < 10; i++) {
          yield [`rapid${i}`];
          // No delay - rapid succession
        }
      }

      const stream = createCSVStream(getRows);
      const chunks = await streamToChunks(stream);

      expect(chunks).toHaveLength(10);
      chunks.forEach((chunk, i) => {
        expect(chunk).toBe(`rapid${i}\n`);
      });
    });

    it('handles mixed async/sync generator operations', async () => {
      async function* getRows() {
        yield ['sync1']; // Synchronous yield
        await Promise.resolve(); // Async operation
        yield ['async1']; // After async
        yield ['sync2']; // Synchronous again
      }

      const stream = createCSVStream(getRows);
      const result = await streamToString(stream);

      expect(result).toBe('sync1\nasync1\nsync2\n');
    });
  });
});
