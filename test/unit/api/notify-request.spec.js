/**
 * @prettier
 */

import { HTTP_STATUS, API_ERROR } from '../../../src/lib/constants';

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
jest.doMock('../../../src/lib/logger', () => logger);

/**
 * Test Data
 */
const options = {
  url: 'http://slack-service',
};
const content = 'Verdaccio@x.x.x successfully published';

describe('notifyRequest', () => {
  test('when notification service throws error', async () => {
    jest.resetModules();
    jest.doMock('request', () => (options, resolver) => {
      const response = {
        statusCode: HTTP_STATUS.BAD_REQUEST,
      };
      const error = {
        message: API_ERROR.BAD_DATA,
      };
      resolver(error, response);
    });

    const notification = require('../../../src/lib/notify/notify-request');

    try {
      const response = await notification.notifyRequest(options, content);
      expect(response).toBeUndefined();
    } catch (error) {
      expect(logger.logger.error).toHaveBeenCalled();
      expect(error).toEqual(API_ERROR.BAD_DATA);
    }
  });

  test('when notification service throws error with null error value', async () => {
    jest.resetModules();
    jest.doMock('request', () => (options, resolver) => {
      const response = {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        body: API_ERROR.BAD_DATA,
      };

      resolver(null, response);
    });

    const notification = require('../../../src/lib/notify/notify-request');

    try {
      const response = await notification.notifyRequest(options, content);
      expect(response).toBeUndefined();
    } catch (error) {
      expect(logger.logger.error).toHaveBeenCalled();
      expect(error).toEqual(API_ERROR.BAD_DATA);
    }
  });

  test('when notification is successfully delivered', async () => {
    jest.resetModules();
    jest.doMock('request', () => (options, resolver) => {
      const response = {
        statusCode: HTTP_STATUS.OK,
        body: 'Successfully delivered',
      };

      resolver(null, response, response.body);
    });

    const notification = require('../../../src/lib/notify/notify-request');

    try {
      const response = await notification.notifyRequest(options, content);
      expect(response).toEqual('Successfully delivered');
      expect(logger.logger.info).toHaveBeenCalled();
      expect(logger.logger.debug).toHaveBeenCalled();
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  test('when notification is successfully delivered but body is undefined/null', async () => {
    jest.resetModules();
    jest.doMock('request', () => (options, resolver) => {
      const response = {
        statusCode: HTTP_STATUS.OK,
      };

      resolver(null, response);
    });

    const notification = require('../../../src/lib/notify/notify-request');

    try {
      await notification.notifyRequest(options, content);
    } catch (error) {
      expect(logger.logger.info).toHaveBeenCalled();
      expect(error.message).toEqual('body is missing');
    }
  });
});
