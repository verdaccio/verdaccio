const { errorUtils } = require('@verdaccio/core');

module.exports = function () {
  return {
    authenticateFake(user, pass, callback) {
      /* user and pass are used here to forward errors
      and success types respectively for testing purposes */
      callback(errorUtils.getInternalError(), false);
    },
  };
};
