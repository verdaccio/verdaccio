import { beforeEach, describe, expect, test, vi } from 'vitest';

import { logger } from '@verdaccio/logger';

import { displayExperimentsInfoBox } from '../src/experiments';

vi.mock('@verdaccio/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe('displayExperimentsInfoBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('should do nothing when flags is undefined', () => {
    displayExperimentsInfoBox(undefined);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });

  test('should do nothing when flags is null', () => {
    displayExperimentsInfoBox(null);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  test('should do nothing when flags is empty', () => {
    displayExperimentsInfoBox({});
    expect(logger.warn).not.toHaveBeenCalled();
  });

  test('should warn and log enabled experiments', () => {
    displayExperimentsInfoBox({ token: true, search: true });
    expect(logger.warn).toHaveBeenCalledOnce();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('token'));
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('is enabled'));
  });

  test('should log disabled experiments', () => {
    displayExperimentsInfoBox({ token: false });
    expect(logger.warn).toHaveBeenCalledOnce();
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('is disabled'));
  });
});
