const FILE_SIZE_FORMAT = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  style: 'decimal',
});

/**
 * Format a file size in bytes into a human-readable string using decimal SI units.
 *
 * @param size - File size in bytes.
 * @returns The formatted size with a unit suffix ("B", "Kb", "Mb", or "Gb"); numeric value is formatted with up to two fraction digits.
 * @throws Error if `size` is negative.
 */
export function formatFileSize(size: number): string {
  if (!Number.isFinite(size) || size < 0) {
    throw new Error('File size must be a finite, non-negative number');
  }

  if (size < 1_000) {
    return `${FILE_SIZE_FORMAT.format(size)} B`;
  }

  if (size < 1_000_000) {
    return `${FILE_SIZE_FORMAT.format(size / 1_000)} KB`;
  }

  if (size < 1_000_000_000) {
    return `${FILE_SIZE_FORMAT.format(size / 1_000_000)} MB`;
  }

  return `${FILE_SIZE_FORMAT.format(size / 1_000_000_000)} GB`;
}
