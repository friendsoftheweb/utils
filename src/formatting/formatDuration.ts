/**
 * Format a duration in seconds to a string in the format "HH:MM:SS" or "MM:SS".
 *
 * @param durationInSeconds - The duration in seconds.
 * @returns The formatted duration string.
 * @throws Error if `durationInSeconds` is negative or not finite.
 */
export function formatDuration(durationInSeconds: number) {
  if (!Number.isFinite(durationInSeconds) || durationInSeconds < 0) {
    throw new Error('Duration must be a finite, non-negative number');
  }

  const seconds = Math.floor(durationInSeconds) % 60;
  const minutes = Math.floor(durationInSeconds / 60) % 60;
  const hours = Math.floor(durationInSeconds / (60 * 60));

  if (hours > 0) {
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  }

  return [
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
}
