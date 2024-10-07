import crypto from 'crypto';

export function randomBytes(bytes) {
  return crypto.randomBytes(bytes);
}
