import { serializeCSVCell } from '../serializeCSVCell';

describe('serializeCSVCell', () => {
  it('should serialize strings correctly', () => {
    expect(serializeCSVCell('simple')).toBe('simple');
    expect(serializeCSVCell('with,comma')).toBe('"with,comma"');
    expect(serializeCSVCell('with"quote')).toBe('"with""quote"');
    expect(serializeCSVCell('with\nnewline')).toBe('"with\nnewline"');
  });

  it('should serialize numbers correctly', () => {
    expect(serializeCSVCell(42)).toBe('42');
    expect(serializeCSVCell(3.14)).toBe('3.14');
    expect(serializeCSVCell(0.1235)).toBe('0.124');
    expect(serializeCSVCell(-1000)).toBe('-1000');
  });

  it('should serialize booleans correctly', () => {
    expect(serializeCSVCell(true)).toBe('true');
    expect(serializeCSVCell(false)).toBe('false');
  });

  it('should serialize null and undefined as empty strings', () => {
    expect(serializeCSVCell(null)).toBe('');
    expect(serializeCSVCell(undefined)).toBe('');
  });

  it('should serialize dates correctly', () => {
    const date = new Date('2024-01-01T12:00:00Z');

    expect(serializeCSVCell(date)).toBe('"January 1, 2024"');
  });

  it('should use custom number and date formats when provided', () => {
    const customNumberFormat = new Intl.NumberFormat('de-DE', {
      maximumFractionDigits: 2,
    });

    const customDateFormat = new Intl.DateTimeFormat('de-DE', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });

    expect(
      serializeCSVCell(1234.5678, { numberFormat: customNumberFormat }),
    ).toBe('"1.234,57"');

    const date = new Date('2024-01-01T12:00:00Z');

    expect(serializeCSVCell(date, { dateFormat: customDateFormat })).toBe(
      '01.01.24',
    );
  });

  it('should handle edge case numeric values', () => {
    expect(serializeCSVCell(NaN)).toBe('');
    expect(serializeCSVCell(Infinity)).toBe('∞'); // or whatever the expected output is
    expect(serializeCSVCell(-Infinity)).toBe('-∞'); // or whatever the expected output is
    expect(serializeCSVCell(1e21)).toMatch(/^\d+$/); // verify no scientific notation
    expect(serializeCSVCell(1e-10)).toBe('0'); // verify very small numbers
  });
});
