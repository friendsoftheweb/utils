import { camelCase, upperFirst, snakeCase } from 'lodash-es';

import type { JSONValue } from '../types';

export function deepTransformKeys(
  transformKey: (key: string) => string,
): (value: JSONValue) => JSONValue;

export function deepTransformKeys(
  transformKey: (key: string) => string,
  value: JSONValue,
): JSONValue;

/**
 * Recursively transform the keys of an object or array using the provided
 * `transformKey` function.
 *
 * @param transformKey - Function to transform each key
 * @param value - The object or array to transform
 * @returns A new object or array with transformed keys
 */
export function deepTransformKeys(
  transformKey: (key: string) => string,
  value?: JSONValue,
) {
  if (arguments.length === 1) {
    return (value: JSONValue) => deepTransformKeys(transformKey, value);
  }

  if (
    value == null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(deepTransformKeys(transformKey)) as JSONValue;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => [
      transformKey(key),
      deepTransformKeys(transformKey)(value),
    ]),
  );
}

function pascalCase(key: string): string {
  return upperFirst(camelCase(key));
}

export const deepCamelCaseKeys = deepTransformKeys(camelCase);

export const deepSnakeCaseKeys = deepTransformKeys(snakeCase);

export const deepPascalCaseKeys = deepTransformKeys(pascalCase);
