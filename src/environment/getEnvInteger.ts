/**
 * Retrieves an environment variable and parses it as an integer.
 *
 * If the variable is not defined, it returns the provided default value or
 * throws a descriptive error. If the variable cannot be parsed as a number,
 * it throws an error.
 *
 * @param name - The name of the environment variable to retrieve.
 * @param defaultValue - An optional default value to return if the variable is
 * not defined.
 *
 * @throws Will throw an error if the environment variable is not defined and no
 * default value is provided, or if the variable cannot be parsed as an integer.
 *
 * @example
 * ```ts
 * // Assuming process.env.PORT = '3000'
 * const port = getEnvInteger('PORT'); // returns 3000
 *
 * // Assuming process.env.TIMEOUT is not defined
 * const timeout = getEnvInteger('TIMEOUT', 5000); // returns 5000
 * ```
 */
export function getEnvInteger<T = number>(
  name: string,
  defaultValue?: T,
): number | T {
  const unparsedValue = process.env[name];

  let value: number | T | undefined;

  if (unparsedValue != null) {
    value = parseInt(unparsedValue, 10);

    if (Number.isNaN(value)) {
      throw new Error(
        `Environment variable "${name}" could not be parsed as a number`,
      );
    }
  } else {
    value = defaultValue;
  }

  if (value === undefined) {
    throw new Error(`Environment variable "${name}" is not defined`);
  }

  return value;
}
