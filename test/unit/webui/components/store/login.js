/**
 * API mock for login endpoint
 * @param {object}  config configuration of api call
 * @returns {promise}
 */
export default function(config) {
  return new Promise((resolve, reject) => {
    const body = JSON.parse(config.body);
    if (body.username === 'sam' && body.password === '1234') {
        resolve({
          username: 'sam',
          token: 'TEST_TOKEN'
        });
    } else {
      reject({
          error: 'bad username/password, access denied'
      });
    }
  });
}
