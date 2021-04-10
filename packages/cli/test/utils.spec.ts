import { isVersionValid } from '../src/utils';

test('valid version node.js', () => {
  expect(isVersionValid('14.0.0')).toBeTruthy();
});

test('is invalid version node.js', () => {
  expect(isVersionValid('11.0.0')).toBeFalsy();
});

test('Node 12 should valid version node.js', () => {
  expect(isVersionValid('12.0.0')).toBeTruthy();
});
