export function getEnvBoolean<T = boolean>(
  name: string,
  defaultValue?: T,
): boolean | T {
  const value = process.env[name];

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    } else {
      throw new Error(`Environment variable "${name}" is not defined`);
    }
  }

  return value === '1' || value === 'true';
}
