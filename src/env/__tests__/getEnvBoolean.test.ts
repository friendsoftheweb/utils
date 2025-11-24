import { getEnvBoolean } from '../getEnvBoolean';

describe('getEnvBoolean', () => {
  const ENV_VAR_NAME = 'TEST_ENV_BOOLEAN';

  afterEach(() => {
    delete process.env[ENV_VAR_NAME];
  });

  it('returns true for "1" value', () => {
    process.env[ENV_VAR_NAME] = '1';
    const result = getEnvBoolean(ENV_VAR_NAME);
    expect(result).toBe(true);
  });

  it('returns true for "true" value', () => {
    process.env[ENV_VAR_NAME] = 'true';
    const result = getEnvBoolean(ENV_VAR_NAME);
    expect(result).toBe(true);
  });

  it('returns false for "0" value', () => {
    process.env[ENV_VAR_NAME] = '0';
    const result = getEnvBoolean(ENV_VAR_NAME);
    expect(result).toBe(false);
  });

  it('returns false for "false" value', () => {
    process.env[ENV_VAR_NAME] = 'false';
    const result = getEnvBoolean(ENV_VAR_NAME);
    expect(result).toBe(false);
  });

  it('returns the default value if the environment variable is not set', () => {
    const defaultValue = true;
    const result = getEnvBoolean(ENV_VAR_NAME, defaultValue);
    expect(result).toBe(defaultValue);
  });

  it('throws an error if the environment variable is not set and no default value is provided', () => {
    expect(() => getEnvBoolean(ENV_VAR_NAME)).toThrow(
      `Environment variable "${ENV_VAR_NAME}" is not defined`,
    );
  });
});
