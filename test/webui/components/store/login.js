/**
 * API mock for login endpoint
 * @param {object}  config configuration of api call
 * @returns {promise}
 */
export default function(config) {
  return new Promise(function(resolve, reject) {
    if (config.data.username === 'sam' && config.data.password === '1234') {
      resolve({
        status: 200,
        data: {
          username: 'sam',
          token: 'TEST_TOKEN'
        }
      });
    } else {
      reject({
        response: {
          status: 401,
          data: { error: 'Unauthorized' }
        }
      });
    }
  });
}
