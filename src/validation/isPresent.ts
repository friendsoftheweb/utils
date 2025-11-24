import { presence } from '../transformation/presence';

export function isPresent<T>(value: T): value is NonNullable<T> {
  return presence(value) != null;
}
