module.exports = function ( ) {
  return {
    allow_publish(user, pkg, cb) {
      if (pkg.name === 'allow-package' && pkg.version === '2.0.1' && pkg.tag === 'allow') {
        cb(null, true);
      }
      else {
        cb(null, false);
      }
    },

    allow_unpublish(user, pkg, cb) {
      if (pkg.name === 'allow-package' && pkg.version === '2.0.1' && pkg.tag === 'allow') {
        cb(null, true);
      }
      else {
        cb(null, false);
      }
    }

  };
};
