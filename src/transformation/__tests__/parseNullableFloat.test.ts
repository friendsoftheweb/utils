import { parseNullableFloat } from '../parseNullableFloat';

describe('parseNullableFloat', () => {
  describe('when value is a valid integer string', () => {
    it('parses positive integers correctly', () => {
      expect(parseNullableFloat('42')).toBe(42);
      expect(parseNullableFloat('123')).toBe(123);
      expect(parseNullableFloat('1')).toBe(1);
    });

    it('parses negative integers correctly', () => {
      expect(parseNullableFloat('-42')).toBe(-42);
      expect(parseNullableFloat('-1')).toBe(-1);
      expect(parseNullableFloat('-999')).toBe(-999);
    });

    it('parses zero correctly', () => {
      expect(parseNullableFloat('0')).toBe(0);
      expect(parseNullableFloat('-0')).toBe(-0);
    });

    it('handles leading zeros', () => {
      expect(parseNullableFloat('007')).toBe(7);
      expect(parseNullableFloat('000')).toBe(0);
      expect(parseNullableFloat('0123')).toBe(123);
    });
  });

  describe('when value is a valid decimal number string', () => {
    it('parses positive decimal numbers correctly', () => {
      expect(parseNullableFloat('42.7')).toBe(42.7);
      expect(parseNullableFloat('3.14')).toBe(3.14);
      expect(parseNullableFloat('0.99')).toBe(0.99);
      expect(parseNullableFloat('123.456')).toBe(123.456);
    });

    it('parses negative decimal numbers correctly', () => {
      expect(parseNullableFloat('-42.7')).toBe(-42.7);
      expect(parseNullableFloat('-3.14')).toBe(-3.14);
      expect(parseNullableFloat('-0.99')).toBe(-0.99);
    });

    it('handles numbers starting with decimal point', () => {
      expect(parseNullableFloat('.5')).toBe(0.5);
      expect(parseNullableFloat('.123')).toBe(0.123);
      expect(parseNullableFloat('-.5')).toBe(-0.5);
    });

    it('handles numbers ending with decimal point', () => {
      expect(parseNullableFloat('42.')).toBe(42);
      expect(parseNullableFloat('-42.')).toBe(-42);
      expect(parseNullableFloat('0.')).toBe(0);
    });
  });

  describe('when value is in scientific notation', () => {
    it('parses positive scientific notation correctly', () => {
      expect(parseNullableFloat('1e5')).toBe(100000);
      expect(parseNullableFloat('2.5e3')).toBe(2500);
      expect(parseNullableFloat('1.23E-4')).toBe(0.000123);
      expect(parseNullableFloat('5E+2')).toBe(500);
    });

    it('parses negative scientific notation correctly', () => {
      expect(parseNullableFloat('-1e5')).toBe(-100000);
      expect(parseNullableFloat('-2.5e3')).toBe(-2500);
      expect(parseNullableFloat('-1.23E-4')).toBe(-0.000123);
    });

    it('handles edge cases in scientific notation', () => {
      expect(parseNullableFloat('1e0')).toBe(1);
      expect(parseNullableFloat('1e-0')).toBe(1);
      expect(parseNullableFloat('0e5')).toBe(0);
    });
  });

  describe('when value has leading/trailing whitespace', () => {
    it('ignores leading and trailing whitespace', () => {
      expect(parseNullableFloat(' 42 ')).toBe(42);
      expect(parseNullableFloat('  3.14  ')).toBe(3.14);
      expect(parseNullableFloat('\t-42.5\n')).toBe(-42.5);
      expect(parseNullableFloat('\r\n 123.456 \t')).toBe(123.456);
    });
  });

  describe('when value starts with a number but contains other characters', () => {
    it('parses the leading numeric part', () => {
      expect(parseNullableFloat('42abc')).toBe(42);
      expect(parseNullableFloat('3.14xyz')).toBe(3.14);
      expect(parseNullableFloat('99.5 bottles')).toBe(99.5);
      expect(parseNullableFloat('-42.7extra')).toBe(-42.7);
    });

    it('handles mixed alphanumeric strings', () => {
      expect(parseNullableFloat('1000.50$')).toBe(1000.5);
      expect(parseNullableFloat('42.0!')).toBe(42);
      expect(parseNullableFloat('7.5_underscore')).toBe(7.5);
    });
  });

  describe('when value is special number strings', () => {
    it('parses Infinity correctly', () => {
      expect(parseNullableFloat('Infinity')).toBe(Infinity);
      expect(parseNullableFloat('-Infinity')).toBe(-Infinity);
      expect(parseNullableFloat('+Infinity')).toBe(Infinity);
    });

    it('handles infinity with whitespace', () => {
      expect(parseNullableFloat(' Infinity ')).toBe(Infinity);
      expect(parseNullableFloat(' -Infinity ')).toBe(-Infinity);
    });
  });

  describe('when value is not a valid number', () => {
    it('returns undefined for non-numeric strings', () => {
      expect(parseNullableFloat('abc')).toBeUndefined();
      expect(parseNullableFloat('hello')).toBeUndefined();
      expect(parseNullableFloat('xyz123')).toBeUndefined();
      expect(parseNullableFloat('not a number')).toBeUndefined();
    });

    it('returns undefined for strings that start with non-numeric characters', () => {
      expect(parseNullableFloat('$100.50')).toBeUndefined();
      expect(parseNullableFloat('#42.7')).toBeUndefined();
      expect(parseNullableFloat('x3.14')).toBeUndefined();
    });

    it('returns undefined for empty string', () => {
      expect(parseNullableFloat('')).toBeUndefined();
    });

    it('returns undefined for NaN string', () => {
      expect(parseNullableFloat('NaN')).toBeUndefined();
    });

    it('returns undefined for other special strings', () => {
      expect(parseNullableFloat('undefined')).toBeUndefined();
      expect(parseNullableFloat('null')).toBeUndefined();
      expect(parseNullableFloat('true')).toBeUndefined();
      expect(parseNullableFloat('false')).toBeUndefined();
    });
  });

  describe('when value is null', () => {
    it('returns undefined', () => {
      expect(parseNullableFloat(null)).toBeUndefined();
    });
  });

  describe('when value is undefined', () => {
    it('returns undefined', () => {
      expect(parseNullableFloat(undefined)).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('handles very large numbers', () => {
      expect(parseNullableFloat('1.7976931348623157e+308')).toBe(
        1.7976931348623157e308,
      ); // Near MAX_VALUE
      expect(parseNullableFloat('2.2250738585072014e-308')).toBe(
        2.2250738585072014e-308,
      ); // Near MIN_VALUE
    });

    it('handles very small numbers', () => {
      expect(parseNullableFloat('5e-324')).toBe(5e-324); // Smallest positive number
      expect(parseNullableFloat('1e-323')).toBe(1e-323);
    });

    it('handles numbers with many decimal places', () => {
      expect(parseNullableFloat('3.141592653589793')).toBe(3.141592653589793);
      expect(parseNullableFloat('2.718281828459045')).toBe(2.718281828459045);
    });

    it('handles plus sign prefix', () => {
      expect(parseNullableFloat('+42')).toBe(42);
      expect(parseNullableFloat('+3.14')).toBe(3.14);
      expect(parseNullableFloat('+1e5')).toBe(100000);
    });

    it('handles multiple decimal points (invalid)', () => {
      expect(parseNullableFloat('3.14.159')).toBe(3.14); // Stops at first invalid character
    });
  });

  describe('precision and floating point behavior', () => {
    it('maintains precision within JavaScript float limits', () => {
      expect(parseNullableFloat('0.1')).toBe(0.1);
      expect(parseNullableFloat('0.2')).toBe(0.2);
      // Note: 0.1 + 0.2 !== 0.3 in JavaScript due to floating point precision
    });

    it('handles repeating decimals', () => {
      expect(parseNullableFloat('0.33333333333333')).toBe(0.33333333333333);
      expect(parseNullableFloat('0.66666666666667')).toBe(0.66666666666667);
    });
  });

  describe('TypeScript overload behavior', () => {
    it('maintains type safety for string input', () => {
      const result: number = parseNullableFloat('42.5');
      expect(result).toBe(42.5);
    });

    it('maintains type safety for null input', () => {
      const result: undefined = parseNullableFloat(null);
      expect(result).toBeUndefined();
    });

    it('maintains type safety for undefined input', () => {
      const result: undefined = parseNullableFloat(undefined);
      expect(result).toBeUndefined();
    });
  });
});
