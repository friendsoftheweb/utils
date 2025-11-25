import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

import type { TimeZone } from '../types';

import { parseNullableDate } from '../transformation/parseNullableDate';

/**
 * Format a date or date string for use in a "datetime-local" input.
 */
export const formatDateForDateTimeInput = (
  timeZone: TimeZone,
  value: TZDate | Date | string | null | undefined,
) => {
  const parsedValue = parseNullableDate(timeZone, value);

  if (parsedValue == null) {
    return '';
  }

  return format(parsedValue, "yyyy-MM-dd'T'HH:mm");
};
