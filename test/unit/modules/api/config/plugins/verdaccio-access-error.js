import { errorUtils } from '@verdaccio/core';

export default function () {
  return {
    allow_access(user, pkg, callback) {
      if (!user.name) {
        if (pkg.name.includes('401')) {
          return callback(errorUtils.getUnauthorized('auth access failure'));
        }
        if (pkg.name.includes('403')) {
          return callback(errorUtils.getForbidden('auth access failure'));
        }
        return callback(errorUtils.getInternalError('auth access failure'));
      }
      callback(null, false);
    },
  };
};
