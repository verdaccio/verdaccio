import crypto from 'node:crypto';

export function randomBytes(bytes) {
  return crypto.randomBytes(bytes);
}
