module.exports = function ( ) {
  return {
    allow_publish(user, pkg, cb) {
      if (pkg.name === 'disallow-package' && pkg.version === '2.0.0' && pkg.tag === 'disallow') {
        cb(null, false);
      }
      else {
        cb(null, true);
      }
    },

    allow_unpublish(user, pkg, cb) {
      if (pkg.name === 'disallow-package' && pkg.version === '2.0.0' && pkg.tag === 'disallow') {
        cb(null, false);
      }
      else {
        cb(null, true);
      }
    }

  };
};
