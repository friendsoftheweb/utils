import { presence } from './presence';

export interface ParseDelimitedStringOptions<T> {
  delimiter?: string;
  transformValue?: TransformValue<T>;
}

type TransformValue<T> = (value: string) => T;
/**
 * Parses a delimited string into an array of values, with optional transformation.
 * Filters out empty or null values.
 *
 * **NOTE:** Any special regex characters used as delimiters must be escaped
 * (e.g. `'\\|'` instead of `'|'`).
 *
 * @param input - The delimited string to parse
 *
 * @param options.delimiter - The delimiter character (default is comma `,`).
 * Any whitespace around the delimiter will be ignored.
 *
 * @param options.transformValue - A function to transform each parsed value.
 * By default, it trims whitespace and filters out empty values.
 *
 * @example
 * parseDelimitedString('a,b,c'); // returns ['a', 'b', 'c']
 * parseDelimitedString(' a , , b '); // returns ['a', 'b']
 * parseDelimitedString('1;2;3', { delimiter: ';', transformValue: parseInt }); // returns [1, 2, 3]
 */
export function parseDelimitedString<T>(
  input: string,
  options: ParseDelimitedStringOptions<T> = {},
): NonNullable<T>[] {
  const { delimiter = ',', transformValue = defaultTransformValue } = options;

  const pattern = new RegExp(`\\s*${delimiter}\\s*`);

  const result: NonNullable<T>[] = [];

  for (const value of input.split(pattern)) {
    const transformedValue = transformValue(value) as T;

    if (transformedValue != null) {
      result.push(transformedValue);
    }
  }

  return result;
}

function defaultTransformValue(value: string) {
  return presence(value)?.trim();
}
