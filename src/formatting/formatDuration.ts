import { padStart } from 'lodash-es';

/**
 * Format a duration in seconds to a string in the format "HH:MM:SS" or "MM:SS".
 *
 * @param durationInSeconds - The duration in seconds.
 * @returns The formatted duration string.
 */
export function formatDuration(durationInSeconds: number) {
  const seconds = Math.floor(durationInSeconds) % 60;
  const minutes = Math.floor(durationInSeconds / 60) % 60;
  const hours = Math.floor(durationInSeconds / (60 * 60));

  if (hours > 0) {
    return [
      padStart(hours.toString(), 2, '0'),
      padStart(minutes.toString(), 2, '0'),
      padStart(seconds.toString(), 2, '0'),
    ].join(':');
  }

  return [
    padStart(minutes.toString(), 2, '0'),
    padStart(seconds.toString(), 2, '0'),
  ].join(':');
}
