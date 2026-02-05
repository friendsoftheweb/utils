import { isPresentString } from '../validation';

export interface ParseDelimitedStringOptions<T> {
  delimiter?: string;
  transformValue?: T;
}

type TransformValue<T = string> = (value: string) => T;

export function parseDelimitedString<T extends TransformValue>(
  input: string,
  options: ParseDelimitedStringOptions<T>,
): NonNullable<ReturnType<T>>[] {
  const { delimiter = ',', transformValue = defaultTransformValue } = options;

  const pattern = new RegExp(`\\s*${delimiter}\\s*`);

  const result: NonNullable<ReturnType<T>>[] = [];

  for (const value of input.split(pattern)) {
    const transformedValue = transformValue(value) as ReturnType<T>;

    if (transformedValue != null) {
      result.push(transformedValue);
    }
  }

  return result;
}

function defaultTransformValue(value: string) {
  if (isPresentString(value)) {
    return value;
  } else {
    return null;
  }
}
