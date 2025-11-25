const FILE_SIZE_FORMAT = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  style: 'decimal',
});

export function formatFileSize(size: number): string {
  if (size < 0) {
    throw new Error('File size cannot be negative');
  }

  if (size < 1_000) {
    return `${FILE_SIZE_FORMAT.format(size)} B`;
  }

  if (size < 1_000_000) {
    return `${FILE_SIZE_FORMAT.format(size / 1_000)} Kb`;
  }

  if (size < 1_000_000_000) {
    return `${FILE_SIZE_FORMAT.format(size / 1_000_000)} Mb`;
  }

  return `${FILE_SIZE_FORMAT.format(size / 1_000_000_000)} Gb`;
}
