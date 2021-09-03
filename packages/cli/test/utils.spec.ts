import { isVersionValid } from '../src/utils';

test('valid version node.js', () => {
  expect(isVersionValid('14.0.0')).toBeTruthy();
});

test('is invalid version node.js', () => {
  expect(isVersionValid('13.0.0')).toBeFalsy();
});
