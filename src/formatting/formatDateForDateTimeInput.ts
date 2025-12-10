import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

import type { TimeZone } from '../types';

import { parseNullableDate } from '../transformation/parseNullableDate';

export interface FormatDateForDateTimeInputOptions {
  timeZone: TimeZone;
}

/**
 * Format a date or date string for use in a "datetime-local" input.
 */
export function formatDateForDateTimeInput(
  date: TZDate | Date | string | null | undefined,
  options: FormatDateForDateTimeInputOptions,
) {
  const parsedValue = parseNullableDate(date, options);

  if (parsedValue == null) {
    return '';
  }

  return format(parsedValue, "yyyy-MM-dd'T'HH:mm");
}

export function createFormatDateForDateTimeInput(
  options: FormatDateForDateTimeInputOptions,
) {
  return (date: TZDate | Date | string | null | undefined) =>
    formatDateForDateTimeInput(date, options);
}
