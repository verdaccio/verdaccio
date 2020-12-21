import { API_ERROR } from '../../../../lib/constants';
/**
 * API mock for login endpoint
 * @param {object}  config configuration of api call
 * @returns {promise}
 */
export default function login(config): Promise<unknown> {
  return new Promise(function loginCallbackPromise(resolve, reject): void {
    const body = JSON.parse(config.body);
    if (body.username === 'sam' && body.password === '1234') {
      resolve({
        username: 'sam',
        token: 'TEST_TOKEN',
      });
    } else {
      // perhaps we should rethink this reject regarding the eslint rule
      /* eslint-disable prefer-promise-reject-errors */
      reject({
        error: API_ERROR.BAD_USERNAME_PASSWORD,
      });
    }
  });
}
