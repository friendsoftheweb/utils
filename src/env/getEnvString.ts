export function getEnvString<T = string>(
  name: string,
  defaultValue?: T,
): string | T {
  const value = process.env[name] ?? defaultValue;

  if (value === undefined) {
    throw new Error(`Environment variable "${name}" is not defined`);
  }

  return value;
}
