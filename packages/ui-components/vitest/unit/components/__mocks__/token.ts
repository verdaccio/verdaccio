/**
 * Token Utility
 */
import dayjs from 'dayjs';

function encodeBase64(string: string) {
  return Buffer.from(string).toString('base64');
}

export function generateTokenWithTimeRange(amount = 0) {
  const payload = {
    username: 'verdaccio',
    exp: Number.parseInt(String(dayjs(new Date()).add(amount, 'hour').valueOf() / 1000), 10),
  };
  return `xxxxxx.${encodeBase64(JSON.stringify(payload))}.xxxxxx`;
}

export function generateTokenWithExpirationAsString() {
  const payload = { username: 'verdaccio', exp: 'I am not a number' };
  return `xxxxxx.${encodeBase64(JSON.stringify(payload))}.xxxxxx`;
}

export function generateInvalidToken() {
  const payload = `invalidtoken`;
  return `xxxxxx.${encodeBase64(payload)}.xxxxxx`;
}

export function generateTokenWithOutExpiration() {
  const payload = {
    username: 'verdaccio',
  };
  return `xxxxxx.${encodeBase64(JSON.stringify(payload))}.xxxxxx`;
}
