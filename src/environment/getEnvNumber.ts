export function getEnvNumber<T = number>(
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
