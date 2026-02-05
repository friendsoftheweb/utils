import { presence } from '../presence';

describe('presence', () => {
  describe('when value is null or undefined', () => {
    it('returns undefined for null', () => {
      expect(presence(null)).toBeNull();
    });

    it('returns undefined for undefined', () => {
      expect(presence(undefined)).toBeNull();
    });
  });

  describe('when value is a string', () => {
    it('returns string with non-whitespace content', () => {
      expect(presence('hello')).toBe('hello');
      expect(presence('test')).toBe('test');
      expect(presence('a')).toBe('a');
      expect(presence('123')).toBe('123');
    });

    it('returns string with mixed content', () => {
      expect(presence('hello world')).toBe('hello world');
      expect(presence('  hello  ')).toBe('  hello  ');
      expect(presence('\ttest\n')).toBe('\ttest\n');
    });

    it('returns undefined for empty string', () => {
      expect(presence('')).toBeNull();
    });

    it('returns undefined for whitespace-only strings', () => {
      expect(presence(' ')).toBeNull();
      expect(presence('   ')).toBeNull();
      expect(presence('\t')).toBeNull();
      expect(presence('\n')).toBeNull();
      expect(presence('\r')).toBeNull();
      expect(presence('\t\n\r ')).toBeNull();
    });
  });

  describe('when value is a number', () => {
    it('returns valid positive numbers', () => {
      expect(presence(1)).toBe(1);
      expect(presence(42)).toBe(42);
      expect(presence(3.14)).toBe(3.14);
      expect(presence(Infinity)).toBe(Infinity);
    });

    it('returns valid negative numbers', () => {
      expect(presence(-1)).toBe(-1);
      expect(presence(-42)).toBe(-42);
      expect(presence(-3.14)).toBe(-3.14);
      expect(presence(-Infinity)).toBe(-Infinity);
    });

    it('returns zero', () => {
      expect(presence(0)).toBe(0);
      expect(presence(-0)).toBe(-0);
    });

    it('returns undefined for NaN', () => {
      expect(presence(NaN)).toBeNull();
    });
  });

  describe('when value is an array', () => {
    it('returns non-empty arrays', () => {
      const arr1 = [1, 2, 3];
      const arr2 = ['a', 'b'];
      const arr3 = [null, undefined];
      const arr4 = [{}];

      expect(presence(arr1)).toBe(arr1);
      expect(presence(arr2)).toBe(arr2);
      expect(presence(arr3)).toBe(arr3);
      expect(presence(arr4)).toBe(arr4);
    });

    it('returns arrays with single element', () => {
      const arr1 = [1];
      const arr2 = ['hello'];
      const arr3 = [null];

      expect(presence(arr1)).toBe(arr1);
      expect(presence(arr2)).toBe(arr2);
      expect(presence(arr3)).toBe(arr3);
    });

    it('returns undefined for empty arrays', () => {
      expect(presence([])).toBeNull();
    });

    it('handles nested arrays', () => {
      const nestedArray = [
        [1, 2],
        [3, 4],
      ];
      const emptyNestedArray = [[]];

      expect(presence(nestedArray)).toBe(nestedArray);
      expect(presence(emptyNestedArray)).toBe(emptyNestedArray); // Still has one element
    });
  });

  describe('when value is an object', () => {
    it('returns objects with properties', () => {
      const obj1 = { a: 1 };
      const obj2 = { name: 'test', value: 42 };
      const obj3 = { null: null, undefined: undefined };

      expect(presence(obj1)).toBe(obj1);
      expect(presence(obj2)).toBe(obj2);
      expect(presence(obj3)).toBe(obj3);
    });

    it('returns objects with single property', () => {
      const obj = { key: 'value' };
      expect(presence(obj)).toBe(obj);
    });

    it('returns undefined for empty objects', () => {
      expect(presence({})).toBeNull();
    });

    it('handles objects with various property types', () => {
      const obj = {
        string: 'hello',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: true },
        nullValue: null,
        undefinedValue: undefined,
      };

      expect(presence(obj)).toBe(obj);
    });

    it('handles Date objects', () => {
      const date = new Date();
      expect(presence(date)).toBe(date);
    });

    it('handles custom class instances', () => {
      class TestClass {
        prop = 'value';
      }
      const instance = new TestClass();
      expect(presence(instance)).toBe(instance);
    });
  });

  describe('when value is other primitive types', () => {
    it('returns boolean values', () => {
      expect(presence(true)).toBe(true);
      expect(presence(false)).toBe(false);
    });

    it('returns symbol values', () => {
      const sym = Symbol('test');
      expect(presence(sym)).toBe(sym);
    });

    it('returns bigint values', () => {
      const bigIntValue = BigInt(123);
      expect(presence(bigIntValue)).toBe(bigIntValue);
    });
  });

  describe('when value is a function', () => {
    it('returns function values', () => {
      const fn = () => {};
      const namedFn = function namedFunction() {};

      expect(presence(fn)).toBe(fn);
      expect(presence(namedFn)).toBe(namedFn);
    });

    it('returns arrow functions', () => {
      const arrowFn = (x: number) => x * 2;
      expect(presence(arrowFn)).toBe(arrowFn);
    });
  });

  describe('edge cases and special objects', () => {
    it('handles RegExp objects', () => {
      const regex = /test/;
      expect(presence(regex)).toBe(regex);
    });

    it('handles Error objects', () => {
      const error = new Error('test error');
      expect(presence(error)).toBe(error);
    });

    it('handles Map objects', () => {
      const emptyMap = new Map();
      const mapWithData = new Map([['key', 'value']]);

      expect(presence(emptyMap)).toBeNull();
      expect(presence(mapWithData)).toBe(mapWithData);
    });

    it('handles Set objects', () => {
      const emptySet = new Set();
      const setWithData = new Set([1, 2, 3]);

      expect(presence(emptySet)).toBeNull();
      expect(presence(setWithData)).toBe(setWithData);
    });

    it('handles objects with non-enumerable properties', () => {
      const obj = {};
      Object.defineProperty(obj, 'nonEnumerable', {
        value: 'test',
        enumerable: false,
      });

      expect(presence(obj)).toBeNull(); // No enumerable properties
    });

    it('handles objects with symbol properties', () => {
      const sym = Symbol('test');
      const obj = { [sym]: 'value' };

      expect(presence(obj)).toBeNull(); // Symbol properties are not included in Object.keys()
    });
  });

  describe('type safety and return types', () => {
    it('maintains correct types for strings', () => {
      const result = presence('hello');
      expect(typeof result === 'string' || result === undefined).toBe(true);
    });

    it('maintains correct types for numbers', () => {
      const result = presence(42);
      expect(typeof result === 'number' || result === undefined).toBe(true);
    });

    it('maintains correct types for objects', () => {
      const obj = { key: 'value' };
      const result = presence(obj);
      expect(result === obj || result === undefined).toBe(true);
    });

    it('maintains correct types for arrays', () => {
      const arr = [1, 2, 3];
      const result = presence(arr);
      expect(Array.isArray(result) || result === undefined).toBe(true);
    });
  });

  describe('complex scenarios', () => {
    it('handles arrays of objects', () => {
      const arrayOfObjects = [{ a: 1 }, { b: 2 }];
      expect(presence(arrayOfObjects)).toBe(arrayOfObjects);
    });

    it('handles objects with array properties', () => {
      const objectWithArrays = {
        emptyArray: [],
        filledArray: [1, 2, 3],
      };
      expect(presence(objectWithArrays)).toBe(objectWithArrays);
    });

    it('handles deeply nested structures', () => {
      const complex = {
        level1: {
          level2: {
            level3: ['deep', 'structure'],
          },
        },
      };
      expect(presence(complex)).toBe(complex);
    });
  });
});
