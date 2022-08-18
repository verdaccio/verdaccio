import MockDate from 'mockdate';

import { formatLoggingDate, padLeft, padRight } from '../src/utils';

describe('formatLoggingDate', () => {
  test('basic', () => {
    const mockDate = '2018-01-14T11:17:40.712Z';
    MockDate.set(mockDate);
    expect(formatLoggingDate(Date.now(), ' message')).toEqual('[2018-01-14 12:17:40] message');
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
