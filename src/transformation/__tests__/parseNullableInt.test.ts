import { parseNullableInt } from '../parseNullableInt';

describe('parseNullableInt', () => {
  describe('when value is a valid integer string', () => {
    it('parses positive integers correctly', () => {
      expect(parseNullableInt('42')).toBe(42);
      expect(parseNullableInt('123')).toBe(123);
      expect(parseNullableInt('1')).toBe(1);
    });

    it('parses negative integers correctly', () => {
      expect(parseNullableInt('-42')).toBe(-42);
      expect(parseNullableInt('-1')).toBe(-1);
      expect(parseNullableInt('-999')).toBe(-999);
    });

    it('parses zero correctly', () => {
      expect(parseNullableInt('0')).toBe(0);
      expect(parseNullableInt('-0')).toBe(-0);
    });

    it('handles leading zeros', () => {
      expect(parseNullableInt('007')).toBe(7);
      expect(parseNullableInt('000')).toBe(0);
      expect(parseNullableInt('0123')).toBe(123);
    });

    it('handles very large integers', () => {
      expect(parseNullableInt('2147483647')).toBe(2147483647); // Max 32-bit signed int
      expect(parseNullableInt('-2147483648')).toBe(-2147483648); // Min 32-bit signed int
      expect(parseNullableInt('9007199254740991')).toBe(9007199254740991); // MAX_SAFE_INTEGER
    });
  });

  describe('when value is a decimal number string', () => {
    it('truncates decimal values (parseInt behavior)', () => {
      expect(parseNullableInt('42.7')).toBe(42);
      expect(parseNullableInt('3.14')).toBe(3);
      expect(parseNullableInt('-42.9')).toBe(-42);
      expect(parseNullableInt('0.99')).toBe(0);
    });

    it('handles scientific notation (partial parsing)', () => {
      expect(parseNullableInt('1e5')).toBe(1);
      expect(parseNullableInt('2E10')).toBe(2);
    });
  });

  describe('when value starts with a number but contains other characters', () => {
    it('parses the leading numeric part', () => {
      expect(parseNullableInt('42abc')).toBe(42);
      expect(parseNullableInt('123xyz')).toBe(123);
      expect(parseNullableInt('99 bottles')).toBe(99);
      expect(parseNullableInt('-42.5extra')).toBe(-42);
    });

    it('handles mixed alphanumeric strings', () => {
      expect(parseNullableInt('1000$')).toBe(1000);
      expect(parseNullableInt('42!')).toBe(42);
      expect(parseNullableInt('7_underscore')).toBe(7);
    });
  });

  describe('when value is not a valid number', () => {
    it('returns NaN for non-numeric strings', () => {
      expect(parseNullableInt('abc')).toBeUndefined();
      expect(parseNullableInt('hello')).toBeUndefined();
      expect(parseNullableInt('xyz123')).toBeUndefined();
      expect(parseNullableInt('not a number')).toBeUndefined();
    });

    it('returns NaN for strings that start with non-numeric characters', () => {
      expect(parseNullableInt('$100')).toBeUndefined();
      expect(parseNullableInt('.42')).toBeUndefined();
    });

    it('returns NaN for empty string', () => {
      expect(parseNullableInt('')).toBeUndefined();
    });

    it('returns NaN for whitespace-only strings', () => {
      expect(parseNullableInt(' ')).toBeUndefined();
      expect(parseNullableInt('\t')).toBeUndefined();
      expect(parseNullableInt('\n')).toBeUndefined();
      expect(parseNullableInt('   ')).toBeUndefined();
    });
  });

  describe('when value is null', () => {
    it('returns undefined', () => {
      expect(parseNullableInt(null)).toBeUndefined();
    });
  });

  describe('when value is undefined', () => {
    it('returns undefined', () => {
      expect(parseNullableInt(undefined)).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('handles hexadecimal-like strings (parsed as decimal)', () => {
      // parseInt with base 10 will stop at the first non-digit
      expect(parseNullableInt('0xFF')).toBe(0);
      expect(parseNullableInt('0x10')).toBe(0);
      expect(parseNullableInt('10xFF')).toBe(10);
    });

    it('handles binary-like strings (parsed as decimal)', () => {
      expect(parseNullableInt('0b101')).toBe(0);
      expect(parseNullableInt('101b')).toBe(101);
    });

    it('handles octal-like strings (parsed as decimal)', () => {
      expect(parseNullableInt('0o123')).toBe(0);
      expect(parseNullableInt('123o')).toBe(123);
    });

    it('handles numbers beyond JavaScript safe integer range', () => {
      // These will still parse but may lose precision
      expect(parseNullableInt('9007199254740992')).toBe(9007199254740992); // MAX_SAFE_INTEGER + 1
      expect(parseNullableInt('999999999999999999999')).toBe(
        999999999999999999999,
      );
    });

    it('handles infinity-like strings', () => {
      expect(parseNullableInt('Infinity')).toBeUndefined();
      expect(parseNullableInt('-Infinity')).toBeUndefined();
    });

    it('handles special number strings', () => {
      expect(parseNullableInt('NaN')).toBeUndefined();
      expect(parseNullableInt('undefined')).toBeUndefined();
      expect(parseNullableInt('null')).toBeUndefined();
    });
  });

  describe('TypeScript overload behavior', () => {
    it('maintains type safety for string input', () => {
      const result: number = parseNullableInt('42');
      expect(result).toBe(42);
    });

    it('maintains type safety for null input', () => {
      const result: undefined = parseNullableInt(null);
      expect(result).toBeUndefined();
    });

    it('maintains type safety for undefined input', () => {
      const result: undefined = parseNullableInt(undefined);
      expect(result).toBeUndefined();
    });
  });
});
