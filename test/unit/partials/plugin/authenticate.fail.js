import { errorUtils } from '@verdaccio/core';

module.exports = function () {
  return {
    authenticate(user, pass, callback) {
      // we return an 500 error, the second argument must be false.
      // https://verdaccio.org/docs/en/dev-plugins#onerror
      callback(errorUtils.getInternalError(), false);
    },
  };
};
