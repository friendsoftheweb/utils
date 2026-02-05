import { parseDelimitedString } from '../parseDelimitedString';

describe('parseDelimitedString', () => {
  describe('with default options (comma delimiter)', () => {
    it('parses comma-separated values', () => {
      expect(parseDelimitedString('a,b,c', {})).toEqual(['a', 'b', 'c']);
    });

    it('handles whitespace around delimiters', () => {
      expect(parseDelimitedString('a , b , c', {})).toEqual(['a', 'b', 'c']);
      expect(parseDelimitedString('a,  b,   c', {})).toEqual(['a', 'b', 'c']);
    });

    it('trims whitespace around all values', () => {
      expect(parseDelimitedString('  a  ,  b  ,  c  ', {})).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('filters out empty values', () => {
      expect(parseDelimitedString('a,,b', {})).toEqual(['a', 'b']);
      expect(parseDelimitedString(',a,b,', {})).toEqual(['a', 'b']);
      expect(parseDelimitedString('a, ,b', {})).toEqual(['a', 'b']);
    });

    it('filters out whitespace-only values', () => {
      expect(parseDelimitedString('a,   ,b', {})).toEqual(['a', 'b']);
      expect(parseDelimitedString('a,\t,b', {})).toEqual(['a', 'b']);
    });

    it('handles single value input', () => {
      expect(parseDelimitedString('single', {})).toEqual(['single']);
    });

    it('handles empty string input', () => {
      expect(parseDelimitedString('', {})).toEqual([]);
    });

    it('handles input with only delimiters', () => {
      expect(parseDelimitedString(',,,', {})).toEqual([]);
      expect(parseDelimitedString(', , ,', {})).toEqual([]);
    });
  });

  describe('with custom delimiter', () => {
    it('parses semicolon-separated values', () => {
      expect(parseDelimitedString('a;b;c', { delimiter: ';' })).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('parses colon-separated values', () => {
      expect(parseDelimitedString('a:b:c', { delimiter: ':' })).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('handles whitespace around custom delimiters', () => {
      expect(parseDelimitedString('a ; b ; c', { delimiter: ';' })).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('preserves commas when using semicolon delimiter', () => {
      expect(parseDelimitedString('a,b;c,d', { delimiter: ';' })).toEqual([
        'a,b',
        'c,d',
      ]);
    });
  });

  describe('with custom transformValue', () => {
    it('transforms values to uppercase', () => {
      const transformValue = (value: string) => value.toUpperCase();
      expect(parseDelimitedString('a,b,c', { transformValue })).toEqual([
        'A',
        'B',
        'C',
      ]);
    });

    it('transforms values to numbers', () => {
      const transformValue = (value: string) => {
        const num = parseInt(value, 10);
        return isNaN(num) ? null : num;
      };

      expect(parseDelimitedString('1,2,3', { transformValue })).toEqual([
        1, 2, 3,
      ]);
    });

    it('filters out null values returned by transformValue', () => {
      const transformValue = (value: string) => {
        const num = parseInt(value, 10);
        return isNaN(num) ? null : num;
      };

      expect(parseDelimitedString('1,abc,3', { transformValue })).toEqual([
        1, 3,
      ]);
    });

    it('filters out undefined values returned by transformValue', () => {
      const transformValue = (value: string) => {
        if (value === 'skip') return undefined;
        return value;
      };

      expect(parseDelimitedString('a,skip,b', { transformValue })).toEqual([
        'a',
        'b',
      ]);
    });

    it('trims and validates with transformValue', () => {
      const transformValue = (value: string) => {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
      };

      expect(
        parseDelimitedString('  hello  ,  ,  world  ', { transformValue }),
      ).toEqual(['hello', 'world']);
    });

    it('can create objects from values', () => {
      const transformValue = (value: string) => {
        const trimmed = value.trim();
        return trimmed ? { name: trimmed } : null;
      };

      expect(parseDelimitedString('a,b', { transformValue })).toEqual([
        { name: 'a' },
        { name: 'b' },
      ]);
    });
  });

  describe('with both custom delimiter and transformValue', () => {
    it('applies both options correctly', () => {
      const transformValue = (value: string) => parseInt(value, 10) || null;

      expect(
        parseDelimitedString('1|2|3', {
          delimiter: '|',
          transformValue,
        }),
      ).toEqual([1, 2, 3]);
    });
  });

  describe('edge cases', () => {
    it('handles tab characters as whitespace around delimiters', () => {
      expect(parseDelimitedString('a\t,\tb', {})).toEqual(['a', 'b']);
    });

    it('handles newline characters in values', () => {
      expect(parseDelimitedString('a\nb,c', {})).toEqual(['a\nb', 'c']);
    });

    it('handles multi-character delimiters', () => {
      expect(parseDelimitedString('a::b::c', { delimiter: '::' })).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('regex special characters in delimiter are escaped', () => {
      expect(parseDelimitedString('a.b.c', { delimiter: '.' })).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('handles very long input strings', () => {
      const values = Array.from({ length: 100 }, (_, i) => `item${i}`);
      const input = values.join(',');
      expect(parseDelimitedString(input, {})).toEqual(values);
    });

    it('handles unicode characters', () => {
      expect(parseDelimitedString('日本語,한국어,中文', {})).toEqual([
        '日本語',
        '한국어',
        '中文',
      ]);
    });

    it('handles emoji', () => {
      expect(parseDelimitedString('😀,🎉,🚀', {})).toEqual(['😀', '🎉', '🚀']);
    });
  });
});
