import { TZDate } from '@date-fns/tz';

import { parseNullableDate } from '../parseNullableDate';

describe('parseNullableDate', () => {
  const testTimeZone = 'America/New_York';
  const utcTimeZone = 'UTC';

  describe('when value is a TZDate', () => {
    it('returns the same TZDate instance', () => {
      const tzDate = new TZDate(2024, 0, 15, testTimeZone);
      const result = parseNullableDate(testTimeZone, tzDate);

      expect(result).toBe(tzDate);
      expect(result).toBeInstanceOf(TZDate);
    });

    it('returns the TZDate even when timezone differs', () => {
      const tzDate = new TZDate(2024, 0, 15, utcTimeZone);
      const result = parseNullableDate(testTimeZone, tzDate);

      expect(result).toBe(tzDate);
      expect(result).toBeInstanceOf(TZDate);
    });
  });

  describe('when value is a regular Date', () => {
    it('converts Date to TZDate with specified timezone', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = parseNullableDate(testTimeZone, date);

      expect(result).toBeInstanceOf(TZDate);
      expect(result).not.toBe(date);
      expect(result?.getTime()).toBe(date.getTime());
    });

    it('handles Date with UTC timezone', () => {
      const date = new Date('2024-06-15T15:45:30Z');
      const result = parseNullableDate(utcTimeZone, date);

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getTime()).toBe(date.getTime());
    });
  });

  describe('when value is a date string (YYYY-MM-DD)', () => {
    it('parses valid date string correctly', () => {
      const result = parseNullableDate(testTimeZone, '2024-01-15');

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0); // January is 0
      expect(result?.getDate()).toBe(15);
    });

    it('parses date string with leading zeros', () => {
      const result = parseNullableDate(testTimeZone, '2024-03-05');

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(2); // March is 2
      expect(result?.getDate()).toBe(5);
    });

    it('parses date string at year boundaries', () => {
      const result = parseNullableDate(utcTimeZone, '2023-12-31');

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2023);
      expect(result?.getMonth()).toBe(11); // December is 11
      expect(result?.getDate()).toBe(31);
    });

    it('returns null for invalid date format', () => {
      expect(parseNullableDate(testTimeZone, '24-01-15')).toBeNull();
      expect(parseNullableDate(testTimeZone, '2024/01/15')).toBeNull();
      expect(parseNullableDate(testTimeZone, 'January 15, 2024')).toBeNull();
      expect(parseNullableDate(testTimeZone, '2024-1-15')).toBeNull(); // Missing leading zero
      expect(parseNullableDate(testTimeZone, '2024-01-5')).toBeNull(); // Missing leading zero
    });

    it('returns null for malformed date strings', () => {
      expect(parseNullableDate(testTimeZone, '2024-13-15')).toBeNull(); // Invalid month
      expect(parseNullableDate(testTimeZone, '2024-02-30')).toBeNull(); // Invalid day for February
      expect(parseNullableDate(testTimeZone, 'abcd-01-15')).toBeNull(); // Non-numeric year
      expect(parseNullableDate(testTimeZone, '2024-ab-15')).toBeNull(); // Non-numeric month
      expect(parseNullableDate(testTimeZone, '2024-01-ab')).toBeNull(); // Non-numeric day
    });
  });

  describe('when value is a datetime string (YYYY-MM-DDTHH:MM)', () => {
    it('parses valid datetime string correctly', () => {
      const result = parseNullableDate(testTimeZone, '2024-01-15T10:30');

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0); // January is 0
      expect(result?.getDate()).toBe(15);
      expect(result?.getHours()).toBe(10);
      expect(result?.getMinutes()).toBe(30);
    });

    it('parses datetime string with midnight', () => {
      const result = parseNullableDate(utcTimeZone, '2024-06-01T00:00');

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
    });

    it('parses datetime string with 23:59', () => {
      const result = parseNullableDate(testTimeZone, '2024-12-31T23:59');

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getHours()).toBe(23);
      expect(result?.getMinutes()).toBe(59);
    });

    it('returns null for invalid datetime format', () => {
      expect(parseNullableDate(testTimeZone, '2024-01-15T10:30:00')).toBeNull(); // Has seconds
      expect(parseNullableDate(testTimeZone, '2024-01-15 10:30')).toBeNull(); // Space instead of T
      expect(parseNullableDate(testTimeZone, '2024-01-15T10')).toBeNull(); // Missing minutes
      expect(
        parseNullableDate(testTimeZone, '2024-01-15T10:30:00Z'),
      ).toBeNull(); // Has timezone
    });

    it('returns null for invalid time values', () => {
      expect(parseNullableDate(testTimeZone, '2024-01-15T25:30')).toBeNull(); // Invalid hour
      expect(parseNullableDate(testTimeZone, '2024-01-15T10:60')).toBeNull(); // Invalid minute
      expect(parseNullableDate(testTimeZone, '2024-01-15Tab:30')).toBeNull(); // Non-numeric hour
      expect(parseNullableDate(testTimeZone, '2024-01-15T10:ab')).toBeNull(); // Non-numeric minute
    });
  });

  describe('when value is null or undefined', () => {
    it('returns null for null input', () => {
      const result = parseNullableDate(testTimeZone, null);
      expect(result).toBeNull();
    });

    it('returns null for undefined input', () => {
      const result = parseNullableDate(testTimeZone, undefined);
      expect(result).toBeNull();
    });
  });

  describe('when value is an empty or whitespace string', () => {
    it('returns null for whitespace-only string', () => {
      expect(parseNullableDate(testTimeZone, ' ')).toBeNull();
      expect(parseNullableDate(testTimeZone, '   ')).toBeNull();
      expect(parseNullableDate(testTimeZone, '\t')).toBeNull();
      expect(parseNullableDate(testTimeZone, '\n')).toBeNull();
    });
  });

  describe('timezone handling', () => {
    it('creates TZDate in the correct timezone for different timezones', () => {
      const dateString = '2024-07-15T15:30';

      const nyResult = parseNullableDate('America/New_York', dateString);
      const laResult = parseNullableDate('America/Los_Angeles', dateString);
      const utcResult = parseNullableDate('UTC', dateString);

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
      const result = parseNullableDate(utcTimeZone, '2024-02-29');

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(1); // February is 1
      expect(result?.getDate()).toBe(29);
    });

    it('handles non-leap year February correctly', () => {
      // The function uses new TZDate constructor which should handle invalid dates gracefully
      // or the regex validation should prevent reaching this point
      const result = parseNullableDate(utcTimeZone, '2023-02-29');
      expect(result).toBeNull();
    });

    it('handles first day of year', () => {
      const result = parseNullableDate(testTimeZone, '2024-01-01T00:00');

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(1);
      expect(result?.getHours()).toBe(0);
      expect(result?.getMinutes()).toBe(0);
    });

    it('handles last day of year', () => {
      const result = parseNullableDate(testTimeZone, '2024-12-31T23:59');

      expect(result).toBeInstanceOf(TZDate);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(11);
      expect(result?.getDate()).toBe(31);
      expect(result?.getHours()).toBe(23);
      expect(result?.getMinutes()).toBe(59);
    });
  });
});
