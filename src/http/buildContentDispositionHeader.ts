/**
 * Builds a Content-Disposition HTTP header for file downloads with proper filename encoding and sanitization.
 *
 * @param filename - The name of the file to be used in the Content-Disposition header
 * @param options - Options for the header
 * @returns The constructed Content-Disposition header string
 */
export function buildContentDispositionHeader(
  filename: string,
  options: { inline?: boolean } = {},
): string {
  const { inline = false } = options;

  const dispositionType = inline ? 'inline' : 'attachment';

  const legacyFilename = sanitizeFilename(filename);
  const encodedFilename = encodeURIComponent(filename).replace(/'/g, '%27');

  return `${dispositionType}; filename="${legacyFilename}"; filename*=UTF-8''${encodedFilename}`;
}

/**
 * Remove or replace characters not allowed in HTTP headers or filenames quotes,
 * backslashes, newlines, carriage returns, and semicolons
 */
function sanitizeFilename(name: string): string {
  return name.replace(/["\\\r\n;]/g, '_');
}
