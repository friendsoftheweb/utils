import { TZDate } from '@date-fns/tz';

import { parseNullableDate } from '../parseNullableDate';

describe('parseNullableDate', () => {
  const testTimeZone = 'America/New_York';
  const utcTimeZone = 'UTC';

  describe('when value is a TZDate', () => {
    it('returns the same TZDate instance', () => {
      const tzDate = new TZDate(2024, 0, 15, testTimeZone);
      const result = parseNullableDate(tzDate, { timeZone: testTimeZone });

      expect(result).toBe(tzDate);
      expect(result).toBeInstanceOf(TZDate);
    });

    it('returns the TZDate even when timezone differs', () => {
      const tzDate = new TZDate(2024, 0, 15, utcTimeZone);
      const result = parseNullableDate(tzDate, { timeZone: testTimeZone });

      expect(result).toBe(tzDate);
      expect(result).toBeInstanceOf(TZDate);
    });
  });

  describe('when value is a regular Date', () => {
    it('converts Date to TZDate with specified timezone', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = parseNullableDate(date, { timeZone: testTimeZone });

      expect(result).toBeInstanceOf(TZDate);
      expect(result).not.toBe(date);
      expect(result?.getTime()).toBe(date.getTime());
    });

    it('handles Date with UTC timezone', () => {
      const date = new Date('2024-06-15T15:45:30Z');
      const result = parseNullableDate(date, { timeZone: utcTimeZone });

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getTime()).toBe(date.getTime());
    });
  });

  describe('when value is a date string (YYYY-MM-DD)', () => {
    it('parses valid date string correctly', () => {
      const result = parseNullableDate('2024-01-15', {
        timeZone: testTimeZone,
      });

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0); // January is 0
      expect(result?.getDate()).toBe(15);
    });

    it('parses date string with leading zeros', () => {
      const result = parseNullableDate('2024-03-05', {
        timeZone: testTimeZone,
      });

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(2); // March is 2
      expect(result?.getDate()).toBe(5);
    });

    it('parses date string at year boundaries', () => {
      const result = parseNullableDate('2023-12-31', { timeZone: utcTimeZone });

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2023);
      expect(result?.getMonth()).toBe(11); // December is 11
      expect(result?.getDate()).toBe(31);
    });

    it('returns null for invalid date format', () => {
      expect(
        parseNullableDate('24-01-15', { timeZone: testTimeZone }),
      ).toBeNull();

      expect(
        parseNullableDate('2024/01/15', { timeZone: testTimeZone }),
      ).toBeNull();

      expect(
        parseNullableDate('January 15, 2024', { timeZone: testTimeZone }),
      ).toBeNull();

      expect(
        parseNullableDate('2024-1-15', { timeZone: testTimeZone }),
      ).toBeNull(); // Missing leading zero

      expect(
        parseNullableDate('2024-01-5', { timeZone: testTimeZone }),
      ).toBeNull(); // Missing leading zero
    });

    it('returns null for malformed date strings', () => {
      expect(
        parseNullableDate('2024-13-15', { timeZone: testTimeZone }),
      ).toBeNull(); // Invalid month

      expect(
        parseNullableDate('2024-02-30', { timeZone: testTimeZone }),
      ).toBeNull(); // Invalid day for February

      expect(
        parseNullableDate('abcd-01-15', { timeZone: testTimeZone }),
      ).toBeNull(); // Non-numeric year

      expect(
        parseNullableDate('2024-ab-15', { timeZone: testTimeZone }),
      ).toBeNull(); // Non-numeric month

      expect(
        parseNullableDate('2024-01-ab', { timeZone: testTimeZone }),
      ).toBeNull(); // Non-numeric day
    });
  });

  describe('when value is a datetime string (YYYY-MM-DDTHH:MM)', () => {
    it('parses valid datetime string correctly', () => {
      const result = parseNullableDate('2024-01-15T10:30', {
        timeZone: testTimeZone,
      });

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0); // January is 0
      expect(result?.getDate()).toBe(15);
      expect(result?.getHours()).toBe(10);
      expect(result?.getMinutes()).toBe(30);
    });

    it('parses datetime string with midnight', () => {
      const result = parseNullableDate('2024-06-01T00:00', {
        timeZone: utcTimeZone,
      });

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
    });

    it('parses datetime string with 23:59', () => {
      const result = parseNullableDate('2024-12-31T23:59', {
        timeZone: testTimeZone,
      });

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getHours()).toBe(23);
      expect(result?.getMinutes()).toBe(59);
    });

    it('returns null for invalid datetime format', () => {
      expect(
        parseNullableDate('2024-01-15T10:30:00', { timeZone: testTimeZone }),
      ).toBeNull(); // Has seconds

      expect(
        parseNullableDate('2024-01-15 10:30', { timeZone: testTimeZone }),
      ).toBeNull(); // Space instead of T

      expect(
        parseNullableDate('2024-01-15T10', { timeZone: testTimeZone }),
      ).toBeNull(); // Missing minutes

      expect(
        parseNullableDate('2024-01-15T10:30:00Z', { timeZone: testTimeZone }),
      ).toBeNull(); // Has timezone
    });

    it('returns null for invalid time values', () => {
      expect(
        parseNullableDate('2024-01-15T25:30', { timeZone: testTimeZone }),
      ).toBeNull(); // Invalid hour

      expect(
        parseNullableDate('2024-01-15T10:60', { timeZone: testTimeZone }),
      ).toBeNull(); // Invalid minute

      expect(
        parseNullableDate('2024-01-15Tab:30', { timeZone: testTimeZone }),
      ).toBeNull(); // Non-numeric hour

      expect(
        parseNullableDate('2024-01-15T10:ab', { timeZone: testTimeZone }),
      ).toBeNull(); // Non-numeric minute
    });
  });

  describe('when value is null or undefined', () => {
    it('returns null for null input', () => {
      const result = parseNullableDate(null, { timeZone: testTimeZone });

      expect(result).toBeNull();
    });

    it('returns null for undefined input', () => {
      const result = parseNullableDate(undefined, { timeZone: testTimeZone });

      expect(result).toBeNull();
    });
  });

  describe('when value is an empty or whitespace string', () => {
    it('returns null for whitespace-only string', () => {
      expect(parseNullableDate(' ', { timeZone: testTimeZone })).toBeNull();
      expect(parseNullableDate('\t', { timeZone: testTimeZone })).toBeNull();
      expect(parseNullableDate('\n', { timeZone: testTimeZone })).toBeNull();
    });
  });

  describe('timezone handling', () => {
    it('creates TZDate in the correct timezone for different timezones', () => {
      const dateString = '2024-07-15T15:30';

      const nyResult = parseNullableDate(dateString, {
        timeZone: 'America/New_York',
      });

      const laResult = parseNullableDate(dateString, {
        timeZone: 'America/Los_Angeles',
      });

      const utcResult = parseNullableDate(dateString, { timeZone: 'UTC' });

      expect(nyResult).toBeInstanceOf(TZDate);
      expect(laResult).toBeInstanceOf(TZDate);
      expect(utcResult).toBeInstanceOf(TZDate);

      // All should have the same local time but different underlying UTC times due to timezone
      expect(nyResult?.getHours()).toBe(15);
      expect(laResult?.getHours()).toBe(15);
      expect(utcResult?.getHours()).toBe(15);
    });
  });

  describe('edge cases', () => {
    it('handles leap year dates correctly', () => {
      const result = parseNullableDate('2024-02-29', { timeZone: utcTimeZone });

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(1); // February is 1
      expect(result?.getDate()).toBe(29);
    });

    it('handles non-leap year February correctly', () => {
      // The function uses new TZDate constructor which should handle invalid dates gracefully
      // or the regex validation should prevent reaching this point
      const result = parseNullableDate('2023-02-29', { timeZone: utcTimeZone });
      expect(result).toBeNull();
    });

    it('handles first day of year', () => {
      const result = parseNullableDate('2024-01-01T00:00', {
        timeZone: testTimeZone,
      });

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(1);
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
    });

    it('handles last day of year', () => {
      const result = parseNullableDate('2024-12-31T23:59', {
        timeZone: testTimeZone,
      });

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(11);
      expect(result?.getDate()).toBe(31);
      expect(result?.getHours()).toBe(23);
      expect(result?.getMinutes()).toBe(59);
    });
  });
});
