/**
 * Converts a duration in seconds to milliseconds.
 *
 * @param durationInSeconds - The duration in seconds.
 * @returns The duration in milliseconds.
 */
export function seconds(durationInSeconds: number) {
  return durationInSeconds * 1000;
}

/**
 * Converts a duration in minutes to milliseconds.
 *
 * @param durationInMinutes - The duration in minutes.
 * @returns The duration in milliseconds.
 */
export function minutes(durationInMinutes: number) {
  return durationInMinutes * seconds(60);
}

/**
 * Converts a duration in hours to milliseconds.
 *
 * @param durationInHours - The duration in hours.
 * @returns The duration in milliseconds.
 */
export function hours(durationInHours: number) {
  return durationInHours * minutes(60);
}

/**
 * Converts a duration in days to milliseconds.
 *
 * @param durationInDays - The duration in days.
 * @returns The duration in milliseconds.
 */
export function days(durationInDays: number) {
  return durationInDays * hours(24);
}
