/* eslint-disable new-cap */
import { createCipheriv, createDecipheriv } from 'crypto';
import EVP_BytesToKey from 'evp_bytestokey';

export const defaultAlgorithm = 'aes192';
const KEY_SIZE = 24;

export function aesDecryptDeprecatedBackwardCompatible(text, secret: string) {
  const result = EVP_BytesToKey(
    secret,
    null,
    KEY_SIZE * 8, // byte to bit size
    16
  );

  let decipher = createDecipheriv(defaultAlgorithm, result.key, result.iv);
  let decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
  return decrypted.toString();
}

export function aesEncryptDeprecatedBackwardCompatible(text, secret: string) {
  const result = EVP_BytesToKey(
    secret,
    null,
    KEY_SIZE * 8, // byte to bit size
    16
  );

  const cipher = createCipheriv(defaultAlgorithm, result.key, result.iv);
  const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  return encrypted.toString();
}
