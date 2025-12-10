import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

import type { TimeZone } from '../types';

import { parseNullableDate } from '../transformation/parseNullableDate';

export interface FormatDateForDateInputOptions {
  timeZone: TimeZone;
}

/**
 * Format a date or date string for use in a "date" input.
 */
export function formatDateForDateInput(
  date: TZDate | Date | string | null | undefined,
  options: FormatDateForDateInputOptions,
) {
  const parsedValue = parseNullableDate(date, options);

  if (parsedValue == null) {
    return '';
  }

  return format(parsedValue, 'yyyy-MM-dd');
}

export function createFormatDateForDateInput(
  options: FormatDateForDateInputOptions,
) {
  return (date: TZDate | Date | string | null | undefined) =>
    formatDateForDateInput(date, options);
}
