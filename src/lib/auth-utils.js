import {ErrorCode} from './utils';
import {API_ERROR} from './constants';

export function allow_action(action) {
  return function(user, pkg, callback) {
    const {name, groups} = user;
    const hasPermission = pkg[action].some((group) => name === group || groups.includes(group));

    if (hasPermission) {
      return callback(null, true);
    }

    if (name) {
      callback(ErrorCode.getForbidden(`user ${name} is not allowed to ${action} package ${pkg.name}`));
    } else {
      callback(ErrorCode.getForbidden(`unregistered users are not allowed to ${action} package ${pkg.name}`));
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
