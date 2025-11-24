import { isPresentNumber, isPresentString } from '../validation';

export function presence<T>(value: T): NonNullable<T> | undefined {
  if (value == null) {
    return;
  }

  if (typeof value === 'string') {
    return isPresentString(value) ? value : undefined;
  }

  if (typeof value === 'number') {
    return isPresentNumber(value) ? value : undefined;
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value : undefined;
  }

  // @ts-expect-error: Checking for plain object
  if (typeof value === 'object' && value.__proto__ === Object.prototype) {
    return Object.keys(value).length > 0 ? value : undefined;
  }

  if (value instanceof Set || value instanceof Map) {
    return value.size > 0 ? value : undefined;
  }

  return value;
}
