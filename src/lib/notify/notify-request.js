import isNil from 'lodash/isNil';
import logger from '../logger';
import request from 'request';
import {HTTP_STATUS} from '../constants';

export function notifyRequest(options, content) {
  return new Promise((resolve, reject) => {
    request(options, function(err, response, body) {
      if (err || response.statusCode >= HTTP_STATUS.BAD_REQUEST) {
        const errorMessage = isNil(err) ? response.body : err.message;
        logger.logger.error({errorMessage}, 'notify service has thrown an error: @{errorMessage}');

        reject(errorMessage);
      } else {
        logger.logger.info({content}, 'A notification has been shipped: @{content}');
        if (isNil(body) === false) {
          const bodyResolved = isNil(body) === false ? body : null;

          logger.logger.debug({body}, ' body: @{body}');
          return resolve(bodyResolved);
        }

        reject(Error('body is missing'));
      }
    });
  });
}
