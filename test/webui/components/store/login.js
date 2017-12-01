/**
 * API mock for login endpoint
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
    } else if (
      config.data.username === undefined ||
      config.data.password === undefined
    ) {
      reject({
        message: 'something went wrong'
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
