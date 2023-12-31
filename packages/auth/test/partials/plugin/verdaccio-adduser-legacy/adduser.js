module.exports = function () {
  return {
    authenticate(user, pass, callback) {
      // https://verdaccio.org/docs/en/dev-plugins#onsuccess
      // this is a successful login and return a simple group
      callback(null, ['test']);
    },
    add_user(user, password, cb) {
      if (user === 'fail') {
        return cb(Error('bad username'));
      }

      if (user === 'password') {
        return cb(Error('bad password'));
      }

      if (user === 'skip') {
        // if wants to the next plugin
        return cb(null, false);
      }

      cb(null, true);
    },
  };
};
