import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@verdaccio/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

import { logger } from '@verdaccio/logger';

import { displayExperimentsInfoBox } from '../../../../src/lib/experiments';

describe('displayExperimentsInfoBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should return default flags when flags is null', () => {
    const result = displayExperimentsInfoBox(null);
    expect(result).toEqual({ searchRemote: false });
  });

  test('should return default flags when flags is undefined', () => {
    const result = displayExperimentsInfoBox(undefined);
    expect(result).toEqual({ searchRemote: false });
  });

  test('should not log any warning when flags is falsy', () => {
    displayExperimentsInfoBox(null);
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });

  test('should not log when flags is an empty object', () => {
    displayExperimentsInfoBox({});
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });

  test('should return flags with searchRemote forced to false for empty object', () => {
    const result = displayExperimentsInfoBox({});
    expect(result).toEqual({ searchRemote: false });
  });

  test('should log warning when experiments are present', () => {
    displayExperimentsInfoBox({ changePassword: true });
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('experiments are enabled')
    );
  });

  test('should log info for each enabled experiment', () => {
    displayExperimentsInfoBox({ changePassword: true });
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('changePassword')
    );
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('is enabled'));
  });

  test('should log info for each disabled experiment', () => {
    displayExperimentsInfoBox({ changePassword: false });
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('is disabled'));
  });

  test('should log info for multiple experiments', () => {
    displayExperimentsInfoBox({
      changePassword: true,
      token: false,
      search: true,
    });
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledTimes(3);
  });

  test('should return flags with searchRemote always set to false', () => {
    const result = displayExperimentsInfoBox({
      changePassword: true,
      searchRemote: true,
    });
    expect(result.searchRemote).toBe(false);
    expect(result.changePassword).toBe(true);
  });

  test('should preserve all flag values in return except searchRemote', () => {
    const flags = {
      changePassword: true,
      token: false,
      customFeature: 'value',
    };
    const result = displayExperimentsInfoBox(flags);
    expect(result).toEqual({
      changePassword: true,
      token: false,
      customFeature: 'value',
      searchRemote: false,
    });
  });

  test('should override searchRemote even if explicitly set to true', () => {
    const result = displayExperimentsInfoBox({ searchRemote: true });
    expect(result.searchRemote).toBe(false);
  });
});
