'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@octokit/core');
var pluginRequestLog = require('@octokit/plugin-request-log');
var pluginPaginateRest = require('@octokit/plugin-paginate-rest');
var pluginRestEndpointMethods = require('@octokit/plugin-rest-endpoint-methods');

const VERSION = "17.0.0";

const Octokit = core.Octokit // TODO: this really should be
//
//     .plugin([requestLog, paginateRest, restEndpointMethods])
//
// but for mystical reasons, using the line above does set the resulting the
// `octokit` instance type correctly. Neither `octokit.paginate()` nor all the
// endpoint methods such as `octokit.repos.get() are set
.plugin(pluginRequestLog.requestLog).plugin([pluginPaginateRest.paginateRest, pluginRestEndpointMethods.restEndpointMethods]).defaults({
  userAgent: `octokit-rest.js/${VERSION}`
});

exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map
