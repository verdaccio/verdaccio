import {ErrorCode} from './utils';
import {API_ERROR} from './constants';

export function allow_action(action) {
  return function(user, pkg, cb) {
    const ok = pkg[action].reduce(function(prev, curr) {
      if (user.name === curr || user.groups.indexOf(curr) !== -1) {
        return true;
      }

      return prev;
    }, false);

    if (ok) {
      return cb(null, true);
    }

    if (user.name) {
      cb(ErrorCode.getForbidden(`user ${user.name} is not allowed to ${action} package ${pkg.name}`));
    } else {
      cb(ErrorCode.getForbidden(`unregistered users are not allowed to ${action} package ${pkg.name}`));
    }
  };
}

export function getDefaultPlugins() {
  return {
    authenticate: function(user, password, cb) {
      cb(ErrorCode.getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    add_user: function(user, password, cb) {
      return cb(ErrorCode.getConflict(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    allow_access: allow_action('access'),
    allow_publish: allow_action('publish'),
  };
}
