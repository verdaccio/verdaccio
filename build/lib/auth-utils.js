'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allow_action = allow_action;
exports.getDefaultPlugins = getDefaultPlugins;

var _utils = require('./utils');

var _constants = require('./constants');

function allow_action(action) {
  return function (user, pkg, callback) {
    const { name, groups } = user;
    const hasPermission = pkg[action].some(group => name === group || groups.includes(group));

    if (hasPermission) {
      return callback(null, true);
    }

    if (name) {
      callback(_utils.ErrorCode.getForbidden(`user ${name} is not allowed to ${action} package ${pkg.name}`));
    } else {
      callback(_utils.ErrorCode.getForbidden(`unregistered users are not allowed to ${action} package ${pkg.name}`));
    }
  };
}

function getDefaultPlugins() {
  return {
    authenticate(user, password, cb) {
      cb(_utils.ErrorCode.getForbidden(_constants.API_ERROR.BAD_USERNAME_PASSWORD));
    },

    add_user(user, password, cb) {
      return cb(_utils.ErrorCode.getConflict(_constants.API_ERROR.BAD_USERNAME_PASSWORD));
    },

    allow_access: allow_action('access'),
    allow_publish: allow_action('publish')
  };
}