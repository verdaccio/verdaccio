import { DEFAULT_CONFIG, parseConfiguration } from '../src/configuration';

test('parse configuration', () => {
  expect(parseConfiguration({})).toStrictEqual(DEFAULT_CONFIG);
});

test('parse configuration', () => {
  expect(
    parseConfiguration({
      maxage: '4m',
    })
  ).toStrictEqual({
    ...DEFAULT_CONFIG,
    maxage: '4m',
  });
});
