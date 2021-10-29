import { warningUtils } from '@verdaccio/core';

import { logger, setup } from '../src';

const mockWarningUtils = jest.fn();

jest.mock('@verdaccio/core', () => {
  const original = jest.requireActual('@verdaccio/core');
  return {
    warningUtils: {
      ...original.warningUtils,
      emit: (...args) => {
        mockWarningUtils(...args);
      },
    },
  };
});

describe('logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test.skip('should write message logger', () => {
    jest.spyOn(process.stdout, 'write');
    setup([
      {
        level: 'info',
      },
    ]);

    logger.info({ packageName: 'test' }, `publishing or updating a new version for @{packageName}`);
    // FIXME: check expect
    // expect(spyOn).toHaveBeenCalledTimes(2);
  });

  test('throw deprecation warning if multiple loggers configured', () => {
    setup([
      {
        level: 'info',
      },
      {
        level: 'http',
      },
    ]);
    expect(mockWarningUtils).toHaveBeenCalledWith(warningUtils.Codes.VERDEP002);
  });

  test('regression: do not throw deprecation warning if no logger config is provided', () => {
    setup();
    expect(mockWarningUtils).not.toHaveBeenCalled();
  });
});
