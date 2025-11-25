import { getEnvNumber } from '../getEnvNumber';

describe('getEnvNumber', () => {
  const ENV_VAR_NAME = 'TEST_ENV_NUMBER';

  afterEach(() => {
    delete process.env[ENV_VAR_NAME];
  });

  it('returns the parsed number from the environment variable', () => {
    process.env[ENV_VAR_NAME] = '42';
    const result = getEnvNumber(ENV_VAR_NAME);
    expect(result).toBe(42);
  });

  it('returns the default value if the environment variable is not set', () => {
    const defaultValue = 10;
    const result = getEnvNumber(ENV_VAR_NAME, defaultValue);
    expect(result).toBe(defaultValue);
  });

  it('throws an error if the environment variable is not set and no default value is provided', () => {
    expect(() => getEnvNumber(ENV_VAR_NAME)).toThrow(
      `Environment variable "${ENV_VAR_NAME}" is not defined`,
    );
  });

  it('throws an error if the environment variable cannot be parsed as a number', () => {
    process.env[ENV_VAR_NAME] = 'not-a-number';
    expect(() => getEnvNumber(ENV_VAR_NAME)).toThrow(
      `Environment variable "${ENV_VAR_NAME}" could not be parsed as a number`,
    );
  });
});
