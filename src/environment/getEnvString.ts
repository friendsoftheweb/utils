/**
 * Retrieves an environment variable as a string.
 *
 * @param name - The name of the environment variable to retrieve.
 * @param defaultValue - An optional default value to return if the variable is
 * not defined.
 *
 * @throws Will throw an error if the environment variable is not defined and
 * no default value is provided.
 *
 * @example
 * ```ts
 * // Assuming process.env.HOST = 'localhost'
 * const host = getEnvString('HOST'); // returns 'localhost'
 *
 * // Assuming process.env.API_KEY is not defined
 * const apiKey = getEnvString('API_KEY'); // throws an error
 */
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
