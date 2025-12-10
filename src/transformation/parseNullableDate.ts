import { TZDate } from '@date-fns/tz';

import type { TimeZone } from '../types';

import { isPresentString } from '../validation/isPresentString';

export interface ParseNullableDateOptions {
  timeZone: TimeZone;
}

export function parseNullableDate(
  date: TZDate,
  options: ParseNullableDateOptions,
): TZDate;

export function parseNullableDate(
  date: Date,
  options: ParseNullableDateOptions,
): TZDate;

export function parseNullableDate(
  date: string,
  options: ParseNullableDateOptions,
): TZDate | null;

export function parseNullableDate(
  date: null | undefined,
  options: ParseNullableDateOptions,
): null;

export function parseNullableDate(
  date: TZDate | Date | string | null | undefined,
  options: ParseNullableDateOptions,
): TZDate | null;

/**
 * Parse a date, date-time string, Date, or TZDate into a TZDate, returning
 * `null` for `null`/`undefined` or invalid values.
 *
 * @param timeZone - The time zone to use when parsing date strings or Date objects
 * @param value - The date to parse
 * @returns The parsed date, or `null`
 */
export function parseNullableDate(
  date: TZDate | Date | string | null | undefined,
  options: ParseNullableDateOptions,
): TZDate | null {
  const { timeZone } = options;

  if (date instanceof TZDate) {
    return date;
  }

  if (date instanceof Date) {
    return TZDate.tz(options.timeZone as string, date);
  }

  if (isPresentString(date)) {
    const dateMatches = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (dateMatches?.length === 4) {
      const year = parseInt(dateMatches[1], 10);
      const month = parseInt(dateMatches[2], 10) - 1;
      const day = parseInt(dateMatches[3], 10);

      if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
        return null;
      }

      if (month < 0 || month > 11) {
        return null;
      }

      if (day < 1 || day > getMaxDaysInMonth(year, month)) {
        return null;
      }

      return new TZDate(year, month, day, timeZone as string);
    }

    const dateTimeMatches = date.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/,
    );

    if (dateTimeMatches?.length === 6) {
      const year = parseInt(dateTimeMatches[1], 10);
      const month = parseInt(dateTimeMatches[2], 10) - 1;
      const day = parseInt(dateTimeMatches[3], 10);
      const hours = parseInt(dateTimeMatches[4], 10);
      const minutes = parseInt(dateTimeMatches[5], 10);

      if (
        Number.isNaN(year) ||
        Number.isNaN(month) ||
        Number.isNaN(day) ||
        Number.isNaN(hours) ||
        Number.isNaN(minutes)
      ) {
        return null;
      }

      if (month < 0 || month > 11) {
        return null;
      }

      if (day < 1 || day > getMaxDaysInMonth(year, month)) {
        return null;
      }

      if (hours < 0 || hours > 23) {
        return null;
      }

      if (minutes < 0 || minutes > 59) {
        return null;
      }

      return new TZDate(year, month, day, hours, minutes, timeZone as string);
    }
  }

  return null;
}

export function createParseNullableDate(
  options: ParseNullableDateOptions,
): (date: TZDate | Date | string | null | undefined) => TZDate | null {
  return (date) => parseNullableDate(date, options);
}

function getMaxDaysInMonth(year: number, month: number): number {
  if (month === 1) {
    // February
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    return isLeapYear ? 29 : 28;
  }

  const monthDays = [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return monthDays[month];
}
