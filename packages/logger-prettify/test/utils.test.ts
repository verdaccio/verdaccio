import { formatLoggingDate, padLeft, padRight } from '../src/utils';

describe('formatLoggingDate', () => {
  test('basic', () => {
    expect(formatLoggingDate(1585411248203, ' message')).toEqual('[2020-03-28 16:00:48] message');
  });
});

describe('pad', () => {
  test('pad right with custom length', () => {
    expect(padRight('message right', 20)).toEqual('message right       ');
  });

  test('pad right 2', () => {
    expect(padRight('message right')).toEqual('message right ');
  });
  test('pad left', () => {
    expect(padLeft('message left')).toEqual(' message left');
  });
});
