/**
 * Retrieves an environment variable and parses it as a boolean.
 *
 * Converts `1` or `true` (case-insensitive) to true and anything else to false.
 * If the variable is not defined, it returns the provided default value or
 * throws a descriptive error.
 *
 * @param name - The name of the environment variable to retrieve.
 * @param defaultValue - An optional default value to return if the variable is
 * not defined.
 *
 * @throws Will throw an error if the environment variable is not defined and no
 * default value is provided.
 *
 * @example
 * ```ts
 * // Assuming process.env.FEATURE_ENABLED = 'true'
 * const isFeatureEnabled = getEnvBoolean('FEATURE_ENABLED'); // returns true
 *
 * // Assuming process.env.DEBUG_MODE is not defined
 * const isDebugMode = getEnvBoolean('DEBUG_MODE', false); // returns false
 * ```
 */
export function getEnvBoolean<T = boolean>(
  name: string,
  defaultValue?: T,
): boolean | T {
  const value = process.env[name]?.trim().toLowerCase();

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    } else {
      throw new Error(`Environment variable "${name}" is not defined`);
    }
  }

  return value === '1' || value === 'true';
}
