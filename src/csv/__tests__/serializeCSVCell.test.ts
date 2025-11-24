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

  // it('should serialize objects and arrays as JSON strings', () => {
  //   expect(serializeCSVCell({ key: 'value' })).toBe('{"key":"value"}');
  //   expect(serializeCSVCell([1, 2, 3])).toBe('[1,2,3]');
  // });
});
