// @flow

import {ErrorCode} from './utils';
import {API_ERROR} from './constants';

import type {RemoteUser, Package, Callback} from '@verdaccio/types';

export function allow_action(action: string) {
  return function(user: RemoteUser, pkg: Package, callback: Callback) {
    const {name, groups} = user;
    const hasPermission = pkg[action].some((group) => name === group || groups.includes(group));

    if (hasPermission) {
      return callback(null, true);
    }

    if (name) {
      callback(ErrorCode.getForbidden(`user ${name} is not allowed to ${action} package ${pkg.name}`));
    } else {
      callback(ErrorCode.getUnauthorized(`authorization required to ${action} package ${pkg.name}`));
    }
  };
}

export function getDefaultPlugins() {
  return {
    authenticate(user: string, password: string, cb: Callback) {
      cb(ErrorCode.getForbidden(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    add_user(user: string, password: string, cb: Callback) {
      return cb(ErrorCode.getConflict(API_ERROR.BAD_USERNAME_PASSWORD));
    },

    allow_access: allow_action('access'),
    allow_publish: allow_action('publish'),
  };
}
