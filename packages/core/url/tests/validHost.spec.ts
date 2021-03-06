import { isHost } from '../src';

test('valid host', () => {
  expect(isHost('http://ddd.dd.og')).toBeTruthy();
  expect(isHost('https://ddd.dd.og')).toBeTruthy();
  expect(isHost('https://ddd.dd.og/valid')).toBeTruthy();
  expect(isHost('ddd.dd.og')).toBeTruthy();
  expect(isHost('ddd.dd.og:40')).toBeTruthy();
  expect(isHost('ddd.dd.og/someprefix')).toBeTruthy();
});

test('invalid', () => {
  expect(isHost('/ddd.dd.og:40')).toBeFalsy();
  expect(isHost('/')).toBeFalsy();
  expect(isHost('')).toBeFalsy();
  expect(isHost(undefined)).toBeFalsy();
  expect(isHost(`/ddd.dd.og>"<svg onload="alert(1)">`)).toBeFalsy();
});
