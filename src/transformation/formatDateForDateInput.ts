import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

import type { TimeZone } from '../types';

import { parseNullableDate } from './parseNullableDate';

/**
 * Format a date or date string for use in a "date" input.
 */
export const formatDateForDateInput = (
  value: TZDate | Date | string | null | undefined,
  timeZone: TimeZone,
) => {
  const parsedValue = parseNullableDate(value, timeZone);

  if (parsedValue == null) {
    return '';
  }

  return format(parsedValue, 'yyyy-MM-dd');
};
