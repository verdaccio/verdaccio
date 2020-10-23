import setConfigValue from '../src/setConfigValue';

describe('Setting config values', () => {
  const bucket = 'TEST_AWS_S3_BUCKET_NAME';
  const keyPrefix = 'TEST_AWS_S3_BUCKET_PREFIX';
  const sessionToken = 'TEST_AWS_S3_SESSION_TOKEN';

  afterEach(async () => {
    delete process.env[bucket];
    delete process.env[keyPrefix];
  });

  test('should fall back to value if environment variable is not set', () => {
    const expected = bucket;
    const actual = setConfigValue(bucket);

    expect(actual === expected).toBeTruthy();
  });

  test('should use the environment variable value', async () => {
    const expected = 'someBucket';
    process.env[bucket] = expected;
    const actual = setConfigValue(bucket);

    expect(actual === expected).toBeTruthy();
  });

  // Session token is temporary and users will mostly set it as environment variable. Verify.
  test('should use the environment variable value for session token', async () => {
    const expected = 'mySessionToken';
    process.env[sessionToken] = expected;
    const actual = setConfigValue(sessionToken);

    expect(actual === expected).toBeTruthy();
  });
});
