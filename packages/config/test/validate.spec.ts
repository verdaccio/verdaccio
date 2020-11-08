import path from 'path';
import { validateConfig } from '../src/validator';
import { parseConfigFile } from '../src';

test('validate config file', async () => {
  const configYaml = parseConfigFile(path.join(__dirname, '../src/conf/default.yaml'));
  const validatedConfig = await validateConfig(configYaml);
  expect(configYaml).toStrictEqual(validatedConfig);
});

test('invalid config file', async () => {
  const configYaml = parseConfigFile(path.join(__dirname, './partials/validation/invalid.yaml'));
  await expect(validateConfig(configYaml)).rejects.toThrowError('uplinks is a required field');
});

test('number validation server settings is invalid', async () => {
  const configYaml = parseConfigFile(
    path.join(__dirname, './partials/validation/serverSettings.yaml')
  );
  await expect(validateConfig(configYaml)).rejects.toThrowError(
    'server.keepAliveTimeout must be a `number` type, but the final value was: `"60"`.'
  );
});

test('invalid uplinks validation', async () => {
  const configYaml = parseConfigFile(
    path.join(__dirname, './partials/validation/invalidUplinks.yaml')
  );
  await expect(validateConfig(configYaml)).rejects.toThrowError(
    'uplinks must be a `object` type, but the final value was: `null`'
  );
});
