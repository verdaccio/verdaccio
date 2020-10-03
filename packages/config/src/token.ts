import { randomBytes } from 'crypto';

export const TOKEN_VALID_LENGTH = 32;

/**
 * Secret key must have 32 characters.
 */
export function generateRandomSecretKey(): string {
  return randomBytes(TOKEN_VALID_LENGTH).toString('base64').substring(0, TOKEN_VALID_LENGTH);
}
