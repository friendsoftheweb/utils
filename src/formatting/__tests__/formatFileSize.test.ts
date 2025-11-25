import { formatFileSize } from '../formatFileSize';

describe('formatFileSize', () => {
  describe('error handling', () => {
    it('throws error for negative values', () => {
      expect(() => formatFileSize(-1)).toThrow(
        'File size must be a finite, non-negative number',
      );

      expect(() => formatFileSize(-100)).toThrow(
        'File size must be a finite, non-negative number',
      );

      expect(() => formatFileSize(-0.1)).toThrow(
        'File size must be a finite, non-negative number',
      );
    });

    it('handles zero correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('handles very small positive values', () => {
      expect(formatFileSize(0.1)).toBe('0.1 B');
      expect(formatFileSize(0.01)).toBe('0.01 B');
    });
  });

  describe('when size is in bytes (< 1,000)', () => {
    it('formats zero bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('formats single byte correctly', () => {
      expect(formatFileSize(1)).toBe('1 B');
    });

    it('formats small byte values correctly', () => {
      expect(formatFileSize(10)).toBe('10 B');
      expect(formatFileSize(100)).toBe('100 B');
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(999)).toBe('999 B');
    });

    it('formats decimal byte values', () => {
      expect(formatFileSize(1.5)).toBe('1.5 B');
      expect(formatFileSize(99.99)).toBe('99.99 B');
      expect(formatFileSize(512.75)).toBe('512.75 B');
    });

    it('formats maximum byte value before kilobytes', () => {
      expect(formatFileSize(999.9)).toBe('999.9 B');
      expect(formatFileSize(999.99)).toBe('999.99 B');
    });
  });

  describe('when size is in kilobytes (1,000 to 999,999)', () => {
    it('formats exact kilobyte boundaries', () => {
      expect(formatFileSize(1_000)).toBe('1 KB');
      expect(formatFileSize(2_000)).toBe('2 KB');
      expect(formatFileSize(3_000)).toBe('3 KB');
      expect(formatFileSize(10_000)).toBe('10 KB');
    });

    it('formats fractional kilobytes with proper rounding', () => {
      expect(formatFileSize(1_500)).toBe('1.5 KB');
      expect(formatFileSize(2_500)).toBe('2.5 KB');
      expect(formatFileSize(1_250)).toBe('1.25 KB');
      expect(formatFileSize(1_750)).toBe('1.75 KB');
    });

    it('formats kilobytes with decimal precision', () => {
      expect(formatFileSize(1_100)).toBe('1.1 KB');
      expect(formatFileSize(1_230)).toBe('1.23 KB');
      expect(formatFileSize(1_555)).toBe('1.56 KB'); // 1.555 rounded to 2 decimal places
      expect(formatFileSize(1_999)).toBe('2 KB'); // 1.999 rounded to 2
    });

    it('handles rounding edge cases', () => {
      expect(formatFileSize(1_001)).toBe('1 KB'); // 1.001 -> 1
      expect(formatFileSize(1_005)).toBe('1.01 KB'); // 1.005 -> 1.01 (rounds up)
      expect(formatFileSize(1_004)).toBe('1 KB'); // 1.004 -> 1
    });

    it('formats large kilobyte values', () => {
      expect(formatFileSize(100_000)).toBe('100 KB');
      expect(formatFileSize(500_000)).toBe('500 KB');
      expect(formatFileSize(750_000)).toBe('750 KB');
      expect(formatFileSize(999_000)).toBe('999 KB');
    });

    it('formats maximum kilobyte value before megabytes', () => {
      expect(formatFileSize(999_999)).toBe('1,000 KB'); // 999.999 rounds to 1000
      expect(formatFileSize(999_900)).toBe('999.9 KB');
    });
  });

  describe('when size is in megabytes (1,000,000 to 999,999,999)', () => {
    it('formats exact megabyte boundaries', () => {
      expect(formatFileSize(1_000_000)).toBe('1 MB');
      expect(formatFileSize(2_000_000)).toBe('2 MB');
      expect(formatFileSize(5_000_000)).toBe('5 MB');
      expect(formatFileSize(10000000)).toBe('10 MB');
    });

    it('formats fractional megabytes with proper rounding', () => {
      expect(formatFileSize(1500000)).toBe('1.5 MB');
      expect(formatFileSize(2500000)).toBe('2.5 MB');
      expect(formatFileSize(1250000)).toBe('1.25 MB');
      expect(formatFileSize(1750000)).toBe('1.75 MB');
    });

    it('formats megabytes with decimal precision', () => {
      expect(formatFileSize(1100000)).toBe('1.1 MB');
      expect(formatFileSize(1230000)).toBe('1.23 MB');
      expect(formatFileSize(1555000)).toBe('1.56 MB'); // 1.555 rounded
      expect(formatFileSize(1999000)).toBe('2 MB'); // 1.999 rounded
    });

    it('handles rounding edge cases for megabytes', () => {
      expect(formatFileSize(1000001)).toBe('1 MB'); // Just over 1 MB
      expect(formatFileSize(1005000)).toBe('1.01 MB'); // 1.005 rounds up
      expect(formatFileSize(1004000)).toBe('1 MB'); // 1.004 rounds down
    });

    it('formats large megabyte values', () => {
      expect(formatFileSize(100000000)).toBe('100 MB');
      expect(formatFileSize(500000000)).toBe('500 MB');
      expect(formatFileSize(750000000)).toBe('750 MB');
      expect(formatFileSize(999000000)).toBe('999 MB');
    });

    it('formats maximum megabyte value before gigabytes', () => {
      expect(formatFileSize(999999999)).toBe('1,000 MB'); // 999.999999 rounds to 1000
      expect(formatFileSize(999900000)).toBe('999.9 MB');
    });
  });

  describe('when size is in gigabytes (>= 1,000,000,000)', () => {
    it('formats exact gigabyte boundaries', () => {
      expect(formatFileSize(1000000000)).toBe('1 GB');
      expect(formatFileSize(2000000000)).toBe('2 GB');
      expect(formatFileSize(5000000000)).toBe('5 GB');
      expect(formatFileSize(10000000000)).toBe('10 GB');
    });

    it('formats fractional gigabytes with proper rounding', () => {
      expect(formatFileSize(1500000000)).toBe('1.5 GB');
      expect(formatFileSize(2500000000)).toBe('2.5 GB');
      expect(formatFileSize(1250000000)).toBe('1.25 GB');
      expect(formatFileSize(1750000000)).toBe('1.75 GB');
    });

    it('formats gigabytes with decimal precision', () => {
      expect(formatFileSize(1100000000)).toBe('1.1 GB');
      expect(formatFileSize(1230000000)).toBe('1.23 GB');
      expect(formatFileSize(1555000000)).toBe('1.56 GB'); // 1.555 rounded
      expect(formatFileSize(1999000000)).toBe('2 GB'); // 1.999 rounded
    });

    it('handles rounding edge cases for gigabytes', () => {
      expect(formatFileSize(1000000001)).toBe('1 GB'); // Just over 1 GB
      expect(formatFileSize(1005000000)).toBe('1.01 GB'); // 1.005 rounds up
      expect(formatFileSize(1004000000)).toBe('1 GB'); // 1.004 rounds down
    });

    it('formats very large gigabyte values', () => {
      expect(formatFileSize(100000000000)).toBe('100 GB'); // 100 GB
      expect(formatFileSize(500000000000)).toBe('500 GB'); // 500 GB
      expect(formatFileSize(1000000000000)).toBe('1,000 GB'); // 1 TB in GB
      expect(formatFileSize(5000000000000)).toBe('5,000 GB'); // 5 TB in GB
    });
  });

  describe('decimal formatting behavior', () => {
    it('uses en-US number formatting with decimal style', () => {
      // Test that it uses periods for decimal points (en-US format)
      expect(formatFileSize(1_500)).toContain('1.5');
      expect(formatFileSize(1_250_000)).toContain('1.25');
      expect(formatFileSize(1_750_000_000)).toContain('1.75');
    });

    it('limits to maximum 2 decimal places', () => {
      // Test values that would have more than 2 decimal places
      expect(formatFileSize(1_001)).toBe('1 KB'); // 1.001 rounds to 1
      expect(formatFileSize(1_123)).toBe('1.12 KB'); // 1.123 rounds to 1.12
      expect(formatFileSize(1_127)).toBe('1.13 KB'); // 1.127 rounds to 1.13
    });

    it('omits unnecessary decimal places', () => {
      expect(formatFileSize(1_000)).toBe('1 KB'); // Not "1.00 KB"
      expect(formatFileSize(2_000)).toBe('2 KB'); // Not "2.00 KB"
      expect(formatFileSize(1_000_000)).toBe('1 MB'); // Not "1.00 MB"
      expect(formatFileSize(1_000_000_000)).toBe('1 GB'); // Not "1.00 GB"
    });
  });

  describe('boundary value testing', () => {
    it('handles precise boundary transitions', () => {
      expect(formatFileSize(999.99)).toBe('999.99 B');
      expect(formatFileSize(1_000.01)).toBe('1 KB');
      expect(formatFileSize(999_999.99)).toBe('1,000 KB');
      expect(formatFileSize(1_000_000.01)).toBe('1 MB');
      expect(formatFileSize(999_999_999.99)).toBe('1,000 MB');
      expect(formatFileSize(1_000_000_000.01)).toBe('1 GB');
    });

    it('maintains consistent unit progression', () => {
      // Test the boundaries are exactly where expected (1000-based)
      expect(formatFileSize(999)).toBe('999 B');
      expect(formatFileSize(1_000)).toBe('1 KB');
      expect(formatFileSize(999_999)).toBe('1,000 KB');
      expect(formatFileSize(1_000_000)).toBe('1 MB');
      expect(formatFileSize(999_999_999)).toBe('1,000 MB');
      expect(formatFileSize(1_000_000_000)).toBe('1 GB');
    });
  });

  describe('real-world file size examples', () => {
    it('formats typical small file sizes', () => {
      expect(formatFileSize(45)).toBe('45 B'); // Empty text file
      expect(formatFileSize(2_000)).toBe('2 KB'); // Small text document
      expect(formatFileSize(15_000)).toBe('15 KB'); // Small image
    });

    it('formats typical medium file sizes', () => {
      expect(formatFileSize(100_000)).toBe('100 KB'); // Medium document
      expect(formatFileSize(500_000)).toBe('500 KB'); // Large document
      expect(formatFileSize(800_000)).toBe('800 KB'); // Large image
    });

    it('formats typical large file sizes', () => {
      expect(formatFileSize(2_000_000)).toBe('2 MB'); // High-res image
      expect(formatFileSize(50_000_000)).toBe('50 MB'); // Video clip
      expect(formatFileSize(500_000_000)).toBe('500 MB'); // Large video file
    });

    it('formats very large file sizes', () => {
      expect(formatFileSize(2_000_000_000)).toBe('2 GB'); // Large video/software
      expect(formatFileSize(50_000_000_000)).toBe('50 GB'); // Very large files
      expect(formatFileSize(100_000_000_000)).toBe('100 GB'); // Huge datasets
    });
  });

  describe('edge cases and special values', () => {
    it('handles decimal input values correctly', () => {
      expect(formatFileSize(1_023.7)).toBe('1.02 KB');
      expect(formatFileSize(1_000.5)).toBe('1 KB'); // 1.0005 rounds to 1
      expect(formatFileSize(1_000_000.7)).toBe('1 MB'); // 1.0000007 rounds to 1
    });

    it('handles very small positive decimal values', () => {
      expect(formatFileSize(0.001)).toBe('0 B'); // Very small rounds to 0
      expect(formatFileSize(0.1)).toBe('0.1 B');
      expect(formatFileSize(0.01)).toBe('0.01 B');
    });

    it('handles JavaScript number precision limits', () => {
      expect(formatFileSize(Number.MAX_SAFE_INTEGER)).toBe('9,007,199.25 GB');

      expect(formatFileSize(Number.MIN_VALUE)).toBe('0 B');
    });
  });

  describe('consistency and predictability', () => {
    it('handles repeated calls consistently', () => {
      // Ensure function is pure and consistent
      const testSize = 1_500_000;
      const result1 = formatFileSize(testSize);
      const result2 = formatFileSize(testSize);
      expect(result1).toBe(result2);
      expect(result1).toBe('1.5 MB');
    });

    it('maintains logical progression across units', () => {
      // Verify that 1000 of a smaller unit equals 1 of the next unit
      expect(formatFileSize(1_000)).toBe('1 KB');
      expect(formatFileSize(1_000_000)).toBe('1 MB');
      expect(formatFileSize(1_000_000_000)).toBe('1 GB');
    });
  });
});
