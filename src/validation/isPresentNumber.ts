export function isPresentNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}
