import { formatValue } from '../formatValue';

describe('formatValue', () => {
  describe('null handling', () => {
    it('returns null for null input', () => {
      expect(formatValue(null)).toBeNull();
    });

    it('returns null for null input with options', () => {
      expect(formatValue(null, { abbreviate: true })).toBeNull();
      expect(formatValue(null, { unit: 'px' })).toBeNull();
      expect(formatValue(null, { maximumFractionDigits: 2 })).toBeNull();
    });
  });

  describe('basic number formatting without options', () => {
    it('formats integers correctly', () => {
      expect(formatValue(0)).toBe('0');
      expect(formatValue(1)).toBe('1');
      expect(formatValue(42)).toBe('42');
      expect(formatValue(1000)).toBe('1,000');
      expect(formatValue(1234567)).toBe('1,234,567');
    });

    it('formats negative integers correctly', () => {
      expect(formatValue(-1)).toBe('-1');
      expect(formatValue(-42)).toBe('-42');
      expect(formatValue(-1000)).toBe('-1,000');
      expect(formatValue(-1234567)).toBe('-1,234,567');
    });

    it('formats decimal numbers correctly', () => {
      expect(formatValue(1.5)).toBe('1.5');
      expect(formatValue(3.14159)).toBe('3.1');
      expect(formatValue(1000.75)).toBe('1,000.8');
      expect(formatValue(-3.14159)).toBe('-3.1');
    });

    it('uses default significant figures of 1', () => {
      expect(formatValue(1.23456)).toBe('1.2');
      expect(formatValue(1.99)).toBe('2');
      expect(formatValue(1.01)).toBe('1');
    });
  });

  describe('abbreviation option', () => {
    it('does not abbreviate values less than 1000', () => {
      expect(formatValue(999, { abbreviate: true })).toBe('999');
      expect(formatValue(500, { abbreviate: true })).toBe('500');
      expect(formatValue(0, { abbreviate: true })).toBe('0');
    });

    it('abbreviates thousands correctly', () => {
      expect(formatValue(1000, { abbreviate: true })).toBe('1K');
      expect(formatValue(1500, { abbreviate: true })).toBe('1.5K');
      expect(formatValue(2000, { abbreviate: true })).toBe('2K');
      expect(formatValue(12500, { abbreviate: true })).toBe('12.5K');
      expect(formatValue(999000, { abbreviate: true })).toBe('999K');
    });

    it('abbreviates millions correctly', () => {
      expect(formatValue(1000000, { abbreviate: true })).toBe('1M');
      expect(formatValue(1500000, { abbreviate: true })).toBe('1.5M');
      expect(formatValue(12500000, { abbreviate: true })).toBe('12.5M');
      expect(formatValue(999000000, { abbreviate: true })).toBe('999M');
    });

    it('abbreviates billions correctly', () => {
      expect(formatValue(1000000000, { abbreviate: true })).toBe('1B');
      expect(formatValue(1500000000, { abbreviate: true })).toBe('1.5B');
      expect(formatValue(12500000000, { abbreviate: true })).toBe('12.5B');
      expect(formatValue(999000000000, { abbreviate: true })).toBe('999B');
    });

    it('abbreviates trillions correctly', () => {
      expect(formatValue(1000000000000, { abbreviate: true })).toBe('1T');
      expect(formatValue(1500000000000, { abbreviate: true })).toBe('1.5T');
      expect(formatValue(12500000000000, { abbreviate: true })).toBe('12.5T');
      expect(formatValue(999000000000000, { abbreviate: true })).toBe('999T');
    });

    it('handles negative values with abbreviation', () => {
      expect(formatValue(-1000, { abbreviate: true })).toBe('-1K');
      expect(formatValue(-1500000, { abbreviate: true })).toBe('-1.5M');
      expect(formatValue(-2000000000, { abbreviate: true })).toBe('-2B');
      expect(formatValue(-3000000000000, { abbreviate: true })).toBe('-3T');
    });

    it('handles values larger than trillion', () => {
      expect(formatValue(1000000000000000, { abbreviate: true })).toBe(
        '1,000T',
      );

      expect(formatValue(5000000000000000, { abbreviate: true })).toBe(
        '5,000T',
      );
    });

    it('respects significant figures with abbreviation', () => {
      expect(
        formatValue(1234000, { abbreviate: true, maximumFractionDigits: 2 }),
      ).toBe('1.23M');
      expect(
        formatValue(1567000, { abbreviate: true, maximumFractionDigits: 3 }),
      ).toBe('1.567M');
      expect(
        formatValue(1500000, { abbreviate: true, maximumFractionDigits: 0 }),
      ).toBe('2M'); // Rounds to 2
    });
  });

  describe('significant figures option', () => {
    it('formats with 0 significant figures (integers only)', () => {
      expect(formatValue(1.5, { maximumFractionDigits: 0 })).toBe('2');
      expect(formatValue(3.14159, { maximumFractionDigits: 0 })).toBe('3');
      expect(formatValue(1000.75, { maximumFractionDigits: 0 })).toBe('1,001');
    });

    it('formats with 2 significant figures', () => {
      expect(formatValue(1.23456, { maximumFractionDigits: 2 })).toBe('1.23');
      expect(formatValue(3.14159, { maximumFractionDigits: 2 })).toBe('3.14');
      expect(formatValue(1000.789, { maximumFractionDigits: 2 })).toBe(
        '1,000.79',
      );
    });

    it('formats with 3 significant figures', () => {
      expect(formatValue(1.23456, { maximumFractionDigits: 3 })).toBe('1.235');
      expect(formatValue(3.14159, { maximumFractionDigits: 3 })).toBe('3.142');
    });

    it('handles large significant figures values', () => {
      expect(formatValue(1.23456, { maximumFractionDigits: 5 })).toBe(
        '1.23456',
      );
      expect(formatValue(3.14, { maximumFractionDigits: 5 })).toBe('3.14');
    });
  });

  describe('unit option', () => {
    it('formats with space-separated units', () => {
      expect(formatValue(100, { unit: 'px' })).toBe('100 px');
      expect(formatValue(1.5, { unit: 'kg' })).toBe('1.5 kg');
      expect(formatValue(1000, { unit: 'meters' })).toBe('1,000 meters');
      expect(formatValue(-50, { unit: '°C' })).toBe('-50 °C');
    });

    it('formats percentage units without space', () => {
      expect(formatValue(50, { unit: '%' })).toBe('50%');
      expect(formatValue(100, { unit: '%' })).toBe('100%');
      expect(formatValue(0.5, { unit: '%' })).toBe('1%'); // Uses integer format for %
    });

    it('uses integer format for percentage units', () => {
      expect(formatValue(50.75, { unit: '%' })).toBe('51%'); // Rounded to integer
      expect(formatValue(99.2, { unit: '%' })).toBe('99%');
      expect(formatValue(0.8, { unit: '%' })).toBe('1%');
    });

    it('handles null unit (same as no unit)', () => {
      expect(formatValue(100, { unit: null })).toBe('100');
      expect(formatValue(1.5, { unit: null })).toBe('1.5');
    });

    it('combines unit with abbreviation', () => {
      expect(formatValue(1500, { abbreviate: true, unit: 'people' })).toBe(
        '1.5K people',
      );
      expect(formatValue(2000000, { abbreviate: true, unit: 'bytes' })).toBe(
        '2M bytes',
      );
    });

    it('combines unit with significant figures', () => {
      expect(
        formatValue(1.23456, { unit: 'kg', maximumFractionDigits: 2 }),
      ).toBe('1.23 kg');
      expect(formatValue(50.789, { unit: '%', maximumFractionDigits: 2 })).toBe(
        '51%',
      ); // Still uses integer for %
    });
  });

  describe('locales option', () => {
    it('formats with different locales', () => {
      expect(formatValue(1234.56, { locales: 'de-DE' })).toBe('1.234,6');
      expect(formatValue(1234.56, { locales: 'fr-FR' })).toBe('1 234,6');
      expect(formatValue(1234.56, { locales: 'en-GB' })).toBe('1,234.6');
    });

    it('handles locale-specific number formatting with units', () => {
      expect(formatValue(1234.56, { locales: 'de-DE', unit: 'kg' })).toBe(
        '1.234,6 kg',
      );

      expect(formatValue(1234.56, { locales: 'fr-FR', unit: 'meters' })).toBe(
        '1 234,6 meters',
      );
    });

    it('handles locale-specific formatting with abbreviation', () => {
      expect(formatValue(1500000, { locales: 'de-DE', abbreviate: true })).toBe(
        '1,5M',
      );
      expect(formatValue(1500000, { locales: 'fr-FR', abbreviate: true })).toBe(
        '1,5M',
      );
    });
  });

  describe('combined options', () => {
    it('combines abbreviation, unit, and significant figures', () => {
      expect(
        formatValue(1234567, {
          abbreviate: true,
          unit: 'users',
          maximumFractionDigits: 2,
        }),
      ).toBe('1.23M users');
    });

    it('combines locale, abbreviation, and unit', () => {
      expect(
        formatValue(2500000, {
          locales: 'de-DE',
          abbreviate: true,
          unit: 'EUR',
        }),
      ).toBe('2,5M EUR');
    });

    it('combines all options', () => {
      expect(
        formatValue(3456789, {
          locales: 'fr-FR',
          abbreviate: true,
          unit: 'bytes',
          maximumFractionDigits: 3,
        }),
      ).toBe('3,457M bytes');
    });

    it('handles percentage with all options', () => {
      expect(
        formatValue(85.678, {
          locales: 'de-DE',
          unit: '%',
          maximumFractionDigits: 2, // Should be ignored for %
        }),
      ).toBe('86%'); // Still uses integer format
    });
  });

  describe('edge cases and special values', () => {
    it('handles zero correctly in all modes', () => {
      expect(formatValue(0)).toBe('0');
      expect(formatValue(0, { abbreviate: true })).toBe('0');
      expect(formatValue(0, { unit: 'items' })).toBe('0 items');
      expect(formatValue(0, { unit: '%' })).toBe('0%');
    });

    it('handles very small positive numbers', () => {
      expect(formatValue(0.001)).toBe('0');
      expect(formatValue(0.1)).toBe('0.1');
      expect(formatValue(0.01, { maximumFractionDigits: 2 })).toBe('0.01');
    });

    it('handles very large numbers', () => {
      expect(formatValue(Number.MAX_SAFE_INTEGER)).toBe(
        '9,007,199,254,740,991',
      );
      expect(formatValue(Number.MAX_SAFE_INTEGER, { abbreviate: true })).toBe(
        '9,007.2T',
      );
    });

    it('handles infinity values', () => {
      expect(formatValue(Infinity)).toBe('∞');
      expect(formatValue(-Infinity)).toBe('-∞');
      expect(formatValue(Infinity, { abbreviate: true })).toBe('∞');
      expect(formatValue(Infinity, { unit: 'items' })).toBe('∞ items');
    });

    it('handles NaN values', () => {
      expect(() => formatValue(NaN)).toThrow('Cannot format NaN value');
    });

    it('handles boundary values for abbreviation thresholds', () => {
      expect(formatValue(999.99, { abbreviate: true })).toBe('1,000'); // Rounds up but no K
      expect(formatValue(1000.01, { abbreviate: true })).toBe('1K');
      expect(formatValue(999999.99, { abbreviate: true })).toBe('1,000K');
      expect(formatValue(1000000.01, { abbreviate: true })).toBe('1M');
    });
  });

  describe('type safety and overload behavior', () => {
    it('maintains correct return types for number input', () => {
      const result: string = formatValue(42);
      expect(result).toBe('42');
    });

    it('maintains correct return types for null input', () => {
      const result: null = formatValue(null);
      expect(result).toBeNull();
    });

    it('handles union types correctly', () => {
      const value: number | null = Math.random() > 0.5 ? 42 : null;
      const result: string | null = formatValue(value);

      if (value === null) {
        expect(result).toBeNull();
      } else {
        expect(typeof result).toBe('string');
      }
    });
  });

  describe('real-world usage examples', () => {
    it('formats financial values', () => {
      expect(
        formatValue(1234567.89, { unit: 'USD', maximumFractionDigits: 2 }),
      ).toBe('1,234,567.89 USD');
      expect(formatValue(2500000, { abbreviate: true, unit: 'USD' })).toBe(
        '2.5M USD',
      );
      expect(formatValue(50.5, { unit: '%' })).toBe('51%');
    });

    it('formats social media metrics', () => {
      expect(formatValue(1234, { abbreviate: true, unit: 'followers' })).toBe(
        '1.2K followers',
      );
      expect(formatValue(5600000, { abbreviate: true, unit: 'views' })).toBe(
        '5.6M views',
      );
      expect(formatValue(890, { abbreviate: true, unit: 'likes' })).toBe(
        '890 likes',
      );
    });

    it('formats file sizes and data', () => {
      expect(formatValue(1024, { abbreviate: true, unit: 'bytes' })).toBe(
        '1K bytes',
      );
      expect(formatValue(1500000, { abbreviate: true, unit: 'pixels' })).toBe(
        '1.5M pixels',
      );
    });

    it('formats measurements and quantities', () => {
      expect(
        formatValue(1.75, { unit: 'meters', maximumFractionDigits: 2 }),
      ).toBe('1.75 meters');
      expect(formatValue(2500, { unit: 'ml' })).toBe('2,500 ml');
      expect(formatValue(98.6, { unit: '°F', maximumFractionDigits: 1 })).toBe(
        '98.6 °F',
      );
    });

    it('formats progress and completion rates', () => {
      expect(formatValue(75, { unit: '%' })).toBe('75%');
      expect(formatValue(100, { unit: '%complete' })).toBe('100%complete');
      expect(formatValue(85.5, { unit: '%' })).toBe('86%'); // Rounded to integer
    });
  });
});
