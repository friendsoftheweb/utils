export function isPresentString(value: unknown): value is string {
  return typeof value === 'string' && /\S+/.test(value);
}
