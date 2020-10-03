import { generateRandomSecretKey, TOKEN_VALID_LENGTH } from '../src/token';

test('token test valid length', () => {
  const token = generateRandomSecretKey();
  expect(token).toHaveLength(TOKEN_VALID_LENGTH);
});
