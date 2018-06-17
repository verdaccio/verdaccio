/**
 * API mock for login endpoint
 * @param {object}  config configuration of api call
 * @returns {promise}
 */
export default function(config) {
  return new Promise(function(resolve, reject) {
    const body = JSON.parse(config.body);
    if (body.username === 'sam' && body.password === '1234') {
      return new Promise(function(resolve) {
        resolve({
          json: function() {
            return {
              username: 'sam',
              token: 'TEST_TOKEN'
            }
          }
        });
      });
    } else {
      throw Error('Unauthorized');
    }
  });
}
