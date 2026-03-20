module.exports = function () {
  return {
    authenticate(user, pass, callback) {
      // https://verdaccio.org/docs/plugin-auth
      // this is a successful login and return a simple group
      callback(null, ['test']);
    },
  };
};
