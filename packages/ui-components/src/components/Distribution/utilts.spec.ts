import { fileSizeSI, formatLicense } from './utils';

test('formatLicense as  string', () => {
  expect(formatLicense('MIT')).toEqual('MIT');
});

test('formatLicense as format object', () => {
  expect(formatLicense({ type: 'MIT' })).toEqual('MIT');
});

test('fileSizeSI as number 1000', () => {
  expect(fileSizeSI(1000)).toEqual('1.00 kB');
});

test('fileSizeSI as number 0', () => {
  expect(fileSizeSI(0)).toEqual('0.00 Bytes');
});
