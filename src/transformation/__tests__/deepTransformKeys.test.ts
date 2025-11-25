import {
  deepTransformKeys,
  deepCamelCaseKeys,
  deepPascalCaseKeys,
} from '../deepTransformKeys';

describe('deepTransformKeys', () => {
  const toUpperCase = (key: string) => key.toUpperCase();
  const addPrefix = (key: string) => `prefix_${key}`;
  const snakeCase = (key: string) =>
    key.replace(/([A-Z])/g, '_$1').toLowerCase();

  describe('primitive values', () => {
    it('returns null unchanged', () => {
      expect(deepTransformKeys(toUpperCase, null)).toBeNull();
    });

    it('returns strings unchanged', () => {
      expect(deepTransformKeys(toUpperCase, 'hello')).toBe('hello');
      expect(deepTransformKeys(toUpperCase, '')).toBe('');
    });

    it('returns numbers unchanged', () => {
      expect(deepTransformKeys(toUpperCase, 42)).toBe(42);
      expect(deepTransformKeys(toUpperCase, 0)).toBe(0);
      expect(deepTransformKeys(toUpperCase, -1.5)).toBe(-1.5);
    });

    it('returns booleans unchanged', () => {
      expect(deepTransformKeys(toUpperCase, true)).toBe(true);
      expect(deepTransformKeys(toUpperCase, false)).toBe(false);
    });
  });

  describe('simple objects', () => {
    it('transforms object keys', () => {
      const input = { firstName: 'John', lastName: 'Doe' };
      const expected = { FIRSTNAME: 'John', LASTNAME: 'Doe' };

      expect(deepTransformKeys(toUpperCase, input)).toEqual(expected);
    });

    it('handles empty objects', () => {
      expect(deepTransformKeys(toUpperCase, {})).toEqual({});
    });

    it('transforms single property objects', () => {
      const input = { name: 'test' };
      const expected = { NAME: 'test' };

      expect(deepTransformKeys(toUpperCase, input)).toEqual(expected);
    });

    it('handles objects with various value types', () => {
      const input = {
        stringProp: 'hello',
        numberProp: 42,
        booleanProp: true,
        nullProp: null,
      };
      const expected = {
        STRINGPROP: 'hello',
        NUMBERPROP: 42,
        BOOLEANPROP: true,
        NULLPROP: null,
      };

      expect(deepTransformKeys(toUpperCase, input)).toEqual(expected);
    });
  });

  describe('nested objects', () => {
    it('transforms keys in nested objects', () => {
      const input = {
        user: {
          firstName: 'John',
          lastName: 'Doe',
          address: {
            streetName: 'Main St',
            cityName: 'Boston',
          },
        },
      };
      const expected = {
        USER: {
          FIRSTNAME: 'John',
          LASTNAME: 'Doe',
          ADDRESS: {
            STREETNAME: 'Main St',
            CITYNAME: 'Boston',
          },
        },
      };

      expect(deepTransformKeys(toUpperCase, input)).toEqual(expected);
    });

    it('handles deeply nested objects', () => {
      const input = {
        level1: {
          level2: {
            level3: {
              level4: {
                deepProp: 'value',
              },
            },
          },
        },
      };
      const expected = {
        LEVEL1: {
          LEVEL2: {
            LEVEL3: {
              LEVEL4: {
                DEEPPROP: 'value',
              },
            },
          },
        },
      };

      expect(deepTransformKeys(toUpperCase, input)).toEqual(expected);
    });
  });

  describe('arrays', () => {
    it('transforms primitive arrays unchanged', () => {
      expect(deepTransformKeys(toUpperCase, [1, 2, 3])).toEqual([1, 2, 3]);
      expect(deepTransformKeys(toUpperCase, ['a', 'b', 'c'])).toEqual([
        'a',
        'b',
        'c',
      ]);
      expect(deepTransformKeys(toUpperCase, [true, false, null])).toEqual([
        true,
        false,
        null,
      ]);
    });

    it('handles empty arrays', () => {
      expect(deepTransformKeys(toUpperCase, [])).toEqual([]);
    });

    it('transforms objects within arrays', () => {
      const input = [
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Smith' },
      ];
      const expected = [
        { FIRSTNAME: 'John', LASTNAME: 'Doe' },
        { FIRSTNAME: 'Jane', LASTNAME: 'Smith' },
      ];

      expect(deepTransformKeys(toUpperCase, input)).toEqual(expected);
    });

    it('handles mixed arrays with objects and primitives', () => {
      const input = [
        'string',
        42,
        { keyName: 'value' },
        null,
        { anotherKey: 'anotherValue' },
      ] as const;
      const expected = [
        'string',
        42,
        { KEYNAME: 'value' },
        null,
        { ANOTHERKEY: 'anotherValue' },
      ];

      expect(deepTransformKeys(toUpperCase, input as any)).toEqual(expected);
    });

    it('handles nested arrays', () => {
      const input = [
        [1, 2, 3],
        [{ key: 'value' }],
        [['nested', { deepKey: 'deepValue' }]],
      ] as const;
      const expected = [
        [1, 2, 3],
        [{ KEY: 'value' }],
        [['nested', { DEEPKEY: 'deepValue' }]],
      ];

      expect(deepTransformKeys(toUpperCase, input as any)).toEqual(expected);
    });
  });

  describe('complex nested structures', () => {
    it('handles objects with arrays of objects', () => {
      const input = {
        users: [
          { firstName: 'John', lastName: 'Doe' },
          { firstName: 'Jane', lastName: 'Smith' },
        ],
        metadata: {
          totalCount: 2,
          hasMore: false,
        },
      };
      const expected = {
        USERS: [
          { FIRSTNAME: 'John', LASTNAME: 'Doe' },
          { FIRSTNAME: 'Jane', LASTNAME: 'Smith' },
        ],
        METADATA: {
          TOTALCOUNT: 2,
          HASMORE: false,
        },
      };

      expect(deepTransformKeys(toUpperCase, input)).toEqual(expected);
    });

    it('handles arrays with nested objects and arrays', () => {
      const input = [
        {
          user: { name: 'John' },
          posts: [
            { title: 'Post 1', tags: ['tag1', 'tag2'] },
            { title: 'Post 2', tags: [] },
          ],
        },
      ];
      const expected = [
        {
          USER: { NAME: 'John' },
          POSTS: [
            { TITLE: 'Post 1', TAGS: ['tag1', 'tag2'] },
            { TITLE: 'Post 2', TAGS: [] },
          ],
        },
      ];

      expect(deepTransformKeys(toUpperCase, input)).toEqual(expected);
    });
  });

  describe('different transformation functions', () => {
    it('works with prefix transformation', () => {
      const input = { name: 'value', age: 25 };
      const expected = { prefix_name: 'value', prefix_age: 25 };

      expect(deepTransformKeys(addPrefix, input)).toEqual(expected);
    });

    it('works with snake_case transformation', () => {
      const input = { firstName: 'John', lastName: 'Doe' };
      const expected = { first_name: 'John', last_name: 'Doe' };

      expect(deepTransformKeys(snakeCase, input)).toEqual(expected);
    });

    it('works with identity transformation', () => {
      const identity = (key: string) => key;
      const input = { key1: 'value1', key2: { nestedKey: 'nestedValue' } };

      expect(deepTransformKeys(identity, input)).toEqual(input);
    });
  });

  describe('currying behavior', () => {
    it('can be partially applied', () => {
      const upperCaseTransform = deepTransformKeys(toUpperCase);
      const input = { firstName: 'John', lastName: 'Doe' };
      const expected = { FIRSTNAME: 'John', LASTNAME: 'Doe' };

      expect(upperCaseTransform(input)).toEqual(expected);
    });

    it('can be used in functional programming style', () => {
      const data = [
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Smith' },
      ];

      const transformedData = data.map(deepTransformKeys(toUpperCase));

      expect(transformedData).toEqual([
        { FIRSTNAME: 'John', LASTNAME: 'Doe' },
        { FIRSTNAME: 'Jane', LASTNAME: 'Smith' },
      ]);
    });
  });

  describe('edge cases', () => {
    it('handles objects with special key characters', () => {
      const input = {
        'key-with-dashes': 'value1',
        key_with_underscores: 'value2',
        'key.with.dots': 'value3',
        'key with spaces': 'value4',
      };
      const expected = {
        'KEY-WITH-DASHES': 'value1',
        KEY_WITH_UNDERSCORES: 'value2',
        'KEY.WITH.DOTS': 'value3',
        'KEY WITH SPACES': 'value4',
      };

      expect(deepTransformKeys(toUpperCase, input)).toEqual(expected);
    });

    it('handles empty string keys', () => {
      const input = { '': 'empty key value' };
      const expected = { '': 'empty key value' };

      expect(deepTransformKeys(toUpperCase, input)).toEqual(expected);
    });

    it('handles numeric-like string keys', () => {
      const input = { '123': 'numeric key', '0': 'zero key' };
      const expected = { '123': 'numeric key', '0': 'zero key' };

      expect(deepTransformKeys(toUpperCase, input)).toEqual(expected);
    });

    it('preserves object reference equality for primitive values', () => {
      const str = 'unchanged';
      const num = 42;
      const bool = true;

      expect(deepTransformKeys(toUpperCase, str)).toBe(str);
      expect(deepTransformKeys(toUpperCase, num)).toBe(num);
      expect(deepTransformKeys(toUpperCase, bool)).toBe(bool);
      expect(deepTransformKeys(toUpperCase, null)).toBe(null);
    });
  });
});

describe('deepCamelCaseKeys', () => {
  it('transforms keys to camelCase', () => {
    const input = {
      first_name: 'John',
      last_name: 'Doe',
      'user-data': {
        email_address: 'john@example.com',
        phone_number: '123-456-7890',
      },
    };
    const expected = {
      firstName: 'John',
      lastName: 'Doe',
      userData: {
        emailAddress: 'john@example.com',
        phoneNumber: '123-456-7890',
      },
    };

    expect(deepCamelCaseKeys(input)).toEqual(expected);
  });

  it('handles already camelCase keys', () => {
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      userData: {
        emailAddress: 'john@example.com',
      },
    };

    expect(deepCamelCaseKeys(input)).toEqual(input);
  });

  it('transforms snake_case arrays with objects', () => {
    const input = {
      user_list: [
        { first_name: 'John', last_name: 'Doe' },
        { first_name: 'Jane', last_name: 'Smith' },
      ],
    };
    const expected = {
      userList: [
        { firstName: 'John', lastName: 'Doe' },
        { firstName: 'Jane', lastName: 'Smith' },
      ],
    };

    expect(deepCamelCaseKeys(input)).toEqual(expected);
  });

  it('handles mixed case transformations', () => {
    const input = {
      UPPER_CASE: 'value1',
      lower_case: 'value2',
      Mixed_Case: 'value3',
      'kebab-case': 'value4',
    };
    const expected = {
      upperCase: 'value1',
      lowerCase: 'value2',
      mixedCase: 'value3',
      kebabCase: 'value4',
    };

    expect(deepCamelCaseKeys(input)).toEqual(expected);
  });
});

describe('deepPascalCaseKeys', () => {
  it('transforms keys to PascalCase', () => {
    const input = {
      first_name: 'John',
      last_name: 'Doe',
      'user-data': {
        email_address: 'john@example.com',
        phone_number: '123-456-7890',
      },
    };
    const expected = {
      FirstName: 'John',
      LastName: 'Doe',
      UserData: {
        EmailAddress: 'john@example.com',
        PhoneNumber: '123-456-7890',
      },
    };

    expect(deepPascalCaseKeys(input)).toEqual(expected);
  });

  it('handles already PascalCase keys', () => {
    const input = {
      FirstName: 'John',
      LastName: 'Doe',
      UserData: {
        EmailAddress: 'john@example.com',
      },
    };

    expect(deepPascalCaseKeys(input)).toEqual(input);
  });

  it('transforms from camelCase to PascalCase', () => {
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      userData: {
        emailAddress: 'john@example.com',
      },
    };
    const expected = {
      FirstName: 'John',
      LastName: 'Doe',
      UserData: {
        EmailAddress: 'john@example.com',
      },
    };

    expect(deepPascalCaseKeys(input)).toEqual(expected);
  });

  it('handles complex nested structures', () => {
    const input = {
      api_response: {
        user_data: [
          {
            user_profile: {
              first_name: 'John',
              contact_info: {
                email_address: 'john@example.com',
              },
            },
          },
        ],
      },
    };
    const expected = {
      ApiResponse: {
        UserData: [
          {
            UserProfile: {
              FirstName: 'John',
              ContactInfo: {
                EmailAddress: 'john@example.com',
              },
            },
          },
        ],
      },
    };

    expect(deepPascalCaseKeys(input)).toEqual(expected);
  });
});

describe('integration and performance', () => {
  it('handles very deep nesting without stack overflow', () => {
    let deepObject: any = { value: 'deep' };

    // Create 100 levels of nesting
    for (let i = 0; i < 100; i++) {
      deepObject = { [`level_${i}`]: deepObject };
    }

    expect(() => deepCamelCaseKeys(deepObject)).not.toThrow();
  });

  it('handles large arrays efficiently', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => ({
      item_id: i,
      item_name: `Item ${i}`,
    }));

    const result = deepCamelCaseKeys(largeArray) as Array<{
      itemId: number;
      itemName: string;
    }>;

    expect(result).toHaveLength(1000);
    expect(result[0]).toEqual({ itemId: 0, itemName: 'Item 0' });
    expect(result[999]).toEqual({ itemId: 999, itemName: 'Item 999' });
  });

  it('preserves JSON serialization/deserialization compatibility', () => {
    const input = {
      user_data: {
        first_name: 'John',
        preferences: {
          theme_color: 'blue',
          notifications_enabled: true,
        },
      },
    };

    const transformed = deepCamelCaseKeys(input);
    const serialized = JSON.stringify(transformed);
    const deserialized = JSON.parse(serialized);

    expect(deserialized).toEqual({
      userData: {
        firstName: 'John',
        preferences: {
          themeColor: 'blue',
          notificationsEnabled: true,
        },
      },
    });
  });
});
