import { API_ERROR } from '@verdaccio/dev-commons';
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Mocks Logger Service
 */
const logger = {
  logger: {
    error: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
  },
};
jest.doMock('@verdaccio/logger', () => logger);

/**
 * Test Data
 */
const url = 'http://slack-service';
const content = 'Verdaccio@x.x.x successfully published';

describe('Notifications:: notifyRequest', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when notification service throws error', async () => {
    jest.doMock('fetch', () => ( ) => {
      const response = {
        json: () => ({message: API_ERROR.BAD_DATA}),
        ok: false
      };

      return Promise.resolve(response)
    });

    const notification = require('../src/notify-request');
    const args = [{ errorMessage: 'bad data' }, 'notify service has thrown an error: @{errorMessage}'];

    await expect(notification.notifyRequest(url, {}, content)).rejects.toEqual(API_ERROR.BAD_DATA);
    expect(logger.logger.error).toHaveBeenCalledWith(...args);
  });

  test('when notification is successfully delivered', async () => {
    jest.doMock('request', () => (options, resolver) => {
      const response = {
        json: () => Promise.resolve({message: 'Successfully delivered'}),
        ok: true
      };

     Promise.resolve(response);
    });

    const notification = require('../src/notify-request');
    const infoArgs = [{ content }, 'A notification has been shipped: @{content}'];
    const debugArgs = [{ body: 'Successfully delivered' }, ' body: @{body}'];

    await expect(notification.notifyRequest(url, {}, content)).resolves.toEqual('Successfully delivered');
    expect(logger.logger.info).toHaveBeenCalledWith(...infoArgs);
  });
});
