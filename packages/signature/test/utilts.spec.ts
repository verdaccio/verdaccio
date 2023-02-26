import {
  TOKEN_VALID_LENGTH,
  createTarballHash,
  generateRandomSecretKey,
  stringToMD5,
} from '../src/utils';

test('token generation length is valid', () => {
  expect(generateRandomSecretKey()).toHaveLength(TOKEN_VALID_LENGTH);
});

test('string to md5 has valid length', () => {
  expect(stringToMD5(Buffer.from('foo'))).toHaveLength(32);
});

test('create a hash of content', () => {
  expect(typeof createTarballHash().update('1').digest('hex')).toEqual('string');
});
