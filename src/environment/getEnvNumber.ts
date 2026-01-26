import { getEnvInteger } from './getEnvInteger';

/**
 * Alias for `getEnvInteger()` to maintain backward compatibility.
 *
 * Retrieves an environment variable and parses it as a number.
 *
 * If the variable is not defined, it returns the provided default value or
 * throws a descriptive error. If the variable cannot be parsed as a number,
 * it throws an error.
 *
 * @deprecated Use getEnvInteger instead.
 * @param name - The name of the environment variable to retrieve.
 * @param defaultValue - An optional default value to return if the variable is
 * not defined.
 * @throws Will throw an error if the environment variable is not defined and no
 * default value is provided, or if the variable cannot be parsed as a number.
 */
export function getEnvNumber(...args: Parameters<typeof getEnvInteger>) {
  console.warn(
    'Warning: getEnvNumber is deprecated and will be removed in future versions. Please use getEnvInteger instead.',
  );

  return getEnvInteger(...args);
}
