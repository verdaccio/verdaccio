import { HTTP_STATUS, API_ERROR } from '../../../../src/lib/constants';

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
jest.doMock('../../../../src/lib/logger', () => logger);

/**
 * Test Data
 */
const options = {
  url: 'http://slack-service',
};
const content = 'Verdaccio@x.x.x successfully published';

describe('Notifications:: notifyRequest', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('when notification service throws error', async () => {
    jest.doMock('request', () => (options, resolver) => {
      const response = {
        statusCode: HTTP_STATUS.BAD_REQUEST,
      };
      const error = {
        message: API_ERROR.BAD_DATA,
      };
      resolver(error, response);
    });

    const notification = require('../../../../src/lib/notify/notify-request');
    const args = [{ errorMessage: 'bad data' }, 'notify service has thrown an error: @{errorMessage}'];

    await expect(notification.notifyRequest(options, content)).rejects.toEqual(API_ERROR.BAD_DATA);
    expect(logger.logger.error).toHaveBeenCalledWith(...args);
  });

  test('when notification service throws error with null error value', async () => {
    jest.doMock('request', () => (options, resolver) => {
      const response = {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        body: API_ERROR.BAD_DATA,
      };

      resolver(null, response);
    });

    const notification = require('../../../../src/lib/notify/notify-request');
    const args = [{ errorMessage: 'bad data' }, 'notify service has thrown an error: @{errorMessage}'];

    await expect(notification.notifyRequest(options, content)).rejects.toEqual(API_ERROR.BAD_DATA);
    expect(logger.logger.error).toHaveBeenCalledWith(...args);
  });

  test('when notification is successfully delivered', async () => {
    jest.doMock('request', () => (options, resolver) => {
      const response = {
        statusCode: HTTP_STATUS.OK,
        body: 'Successfully delivered',
      };

      resolver(null, response, response.body);
    });

    const notification = require('../../../../src/lib/notify/notify-request');
    const infoArgs = [{ content }, 'A notification has been shipped: @{content}'];
    const debugArgs = [{ body: 'Successfully delivered' }, ' body: @{body}'];

    await expect(notification.notifyRequest(options, content)).resolves.toEqual('Successfully delivered');
    expect(logger.logger.info).toHaveBeenCalledWith(...infoArgs);
    expect(logger.logger.debug).toHaveBeenCalledWith(...debugArgs);
  });

  test('when notification is successfully delivered but body is undefined/null', async () => {
    jest.doMock('request', () => (options, resolver) => {
      const response = {
        statusCode: HTTP_STATUS.OK,
      };

      resolver(null, response);
    });

    const notification = require('../../../../src/lib/notify/notify-request');
    const infoArgs = [{ content }, 'A notification has been shipped: @{content}'];

    await expect(notification.notifyRequest(options, content)).rejects.toThrow('body is missing');
    expect(logger.logger.info).toHaveBeenCalledWith(...infoArgs);
  });
});
