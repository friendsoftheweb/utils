import { getEnvString } from '../getEnvString';

describe('getEnvString', () => {
  const ENV_VAR_NAME = 'TEST_ENV_STRING';

  afterEach(() => {
    delete process.env[ENV_VAR_NAME];
  });

  it('returns the string value from the environment variable', () => {
    process.env[ENV_VAR_NAME] = 'hello world';
    const result = getEnvString(ENV_VAR_NAME);
    expect(result).toBe('hello world');
  });

  it('returns the default value if the environment variable is not set', () => {
    const defaultValue = 'default string';
    const result = getEnvString(ENV_VAR_NAME, defaultValue);
    expect(result).toBe(defaultValue);
  });

  it('throws an error if the environment variable is not set and no default value is provided', () => {
    expect(() => getEnvString(ENV_VAR_NAME)).toThrow(
      `Environment variable "${ENV_VAR_NAME}" is not defined`,
    );
  });
});
