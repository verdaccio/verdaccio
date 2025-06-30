module.exports = function () {
  return {
    authenticate(user, pass, callback) {
      // no access but also no error
      callback(null, false);
    },
  };
};
