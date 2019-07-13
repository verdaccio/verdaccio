import isNil from 'lodash/isNil';
import { logger } from '../logger';
import request, { RequiredUriUrl } from 'request';
import { HTTP_STATUS } from '../constants';

export function notifyRequest(options: RequiredUriUrl, content): Promise<any | Error> {
  return new Promise(
    (resolve, reject): void => {
      request(options, function(err, response, body): void {
        if (err || response.statusCode >= HTTP_STATUS.BAD_REQUEST) {
          const errorMessage = isNil(err) ? response.body : err.message;
          logger.error({ errorMessage }, 'notify service has thrown an error: @{errorMessage}');
          reject(errorMessage);
        } else {
          logger.info({ content }, 'A notification has been shipped: @{content}');
          if (isNil(body) === false) {
            logger.debug({ body }, ' body: @{body}');
            resolve(body);
          }
          reject(Error('body is missing'));
        }
      });
    }
  );
}
