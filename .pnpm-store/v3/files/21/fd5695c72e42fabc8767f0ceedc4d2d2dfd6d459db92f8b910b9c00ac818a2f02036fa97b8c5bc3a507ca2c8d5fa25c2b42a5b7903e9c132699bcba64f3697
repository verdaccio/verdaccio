"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _lodash = _interopRequireDefault(require("lodash"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _whoami = _interopRequireDefault(require("./api/whoami"));

var _ping = _interopRequireDefault(require("./api/ping"));

var _user = _interopRequireDefault(require("./api/user"));

var _distTags = _interopRequireDefault(require("./api/dist-tags"));

var _publish = _interopRequireDefault(require("./api/publish"));

var _search = _interopRequireDefault(require("./api/search"));

var _package = _interopRequireDefault(require("./api/package"));

var _stars = _interopRequireDefault(require("./api/stars"));

var _profile = _interopRequireDefault(require("./api/v1/profile"));

var _token = _interopRequireDefault(require("./api/v1/token"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  match,
  validateName,
  validatePackage,
  encodeScopePackage,
  antiLoop
} = require('../middleware');

function _default(config, auth, storage) {
  /* eslint new-cap:off */
  const app = _express.default.Router();
  /* eslint new-cap:off */
  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  // $FlowFixMe


  app.param('package', validatePackage); // $FlowFixMe

  app.param('filename', validateName);
  app.param('tag', validateName);
  app.param('version', validateName);
  app.param('revision', validateName);
  app.param('token', validateName); // these can't be safely put into express url for some reason
  // TODO: For some reason? what reason?

  app.param('_rev', match(/^-rev$/));
  app.param('org_couchdb_user', match(/^org\.couchdb\.user:/));
  app.param('anything', match(/.*/));
  app.use(auth.apiJWTmiddleware());
  app.use(_bodyParser.default.json({
    strict: false,
    limit: config.max_body_size || '10mb'
  }));
  app.use(antiLoop(config)); // encode / in a scoped package name to be matched as a single parameter in routes

  app.use(encodeScopePackage); // for "npm whoami"

  (0, _whoami.default)(app);
  (0, _package.default)(app, auth, storage, config);
  (0, _profile.default)(app, auth);
  (0, _search.default)(app, auth, storage);
  (0, _user.default)(app, auth, config);
  (0, _distTags.default)(app, auth, storage);
  (0, _publish.default)(app, auth, storage, config);
  (0, _ping.default)(app);
  (0, _stars.default)(app, storage);

  if (_lodash.default.get(config, 'experiments.token') === true) {
    (0, _token.default)(app, auth, storage, config);
  }

  return app;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvZW5kcG9pbnQvaW5kZXgudHMiXSwibmFtZXMiOlsibWF0Y2giLCJ2YWxpZGF0ZU5hbWUiLCJ2YWxpZGF0ZVBhY2thZ2UiLCJlbmNvZGVTY29wZVBhY2thZ2UiLCJhbnRpTG9vcCIsInJlcXVpcmUiLCJjb25maWciLCJhdXRoIiwic3RvcmFnZSIsImFwcCIsImV4cHJlc3MiLCJSb3V0ZXIiLCJwYXJhbSIsInVzZSIsImFwaUpXVG1pZGRsZXdhcmUiLCJib2R5UGFyc2VyIiwianNvbiIsInN0cmljdCIsImxpbWl0IiwibWF4X2JvZHlfc2l6ZSIsIl8iLCJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUVBLE1BQU07QUFBRUEsRUFBQUEsS0FBRjtBQUFTQyxFQUFBQSxZQUFUO0FBQXVCQyxFQUFBQSxlQUF2QjtBQUF3Q0MsRUFBQUEsa0JBQXhDO0FBQTREQyxFQUFBQTtBQUE1RCxJQUF5RUMsT0FBTyxDQUFDLGVBQUQsQ0FBdEY7O0FBRWUsa0JBQVNDLE1BQVQsRUFBeUJDLElBQXpCLEVBQXNDQyxPQUF0QyxFQUFnRTtBQUM3RTtBQUNBLFFBQU1DLEdBQUcsR0FBR0MsaUJBQVFDLE1BQVIsRUFBWjtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7QUFDQUYsRUFBQUEsR0FBRyxDQUFDRyxLQUFKLENBQVUsU0FBVixFQUFxQlYsZUFBckIsRUFSNkUsQ0FTN0U7O0FBQ0FPLEVBQUFBLEdBQUcsQ0FBQ0csS0FBSixDQUFVLFVBQVYsRUFBc0JYLFlBQXRCO0FBQ0FRLEVBQUFBLEdBQUcsQ0FBQ0csS0FBSixDQUFVLEtBQVYsRUFBaUJYLFlBQWpCO0FBQ0FRLEVBQUFBLEdBQUcsQ0FBQ0csS0FBSixDQUFVLFNBQVYsRUFBcUJYLFlBQXJCO0FBQ0FRLEVBQUFBLEdBQUcsQ0FBQ0csS0FBSixDQUFVLFVBQVYsRUFBc0JYLFlBQXRCO0FBQ0FRLEVBQUFBLEdBQUcsQ0FBQ0csS0FBSixDQUFVLE9BQVYsRUFBbUJYLFlBQW5CLEVBZDZFLENBZ0I3RTtBQUNBOztBQUNBUSxFQUFBQSxHQUFHLENBQUNHLEtBQUosQ0FBVSxNQUFWLEVBQWtCWixLQUFLLENBQUMsUUFBRCxDQUF2QjtBQUNBUyxFQUFBQSxHQUFHLENBQUNHLEtBQUosQ0FBVSxrQkFBVixFQUE4QlosS0FBSyxDQUFDLHNCQUFELENBQW5DO0FBQ0FTLEVBQUFBLEdBQUcsQ0FBQ0csS0FBSixDQUFVLFVBQVYsRUFBc0JaLEtBQUssQ0FBQyxJQUFELENBQTNCO0FBRUFTLEVBQUFBLEdBQUcsQ0FBQ0ksR0FBSixDQUFRTixJQUFJLENBQUNPLGdCQUFMLEVBQVI7QUFDQUwsRUFBQUEsR0FBRyxDQUFDSSxHQUFKLENBQVFFLG9CQUFXQyxJQUFYLENBQWdCO0FBQUVDLElBQUFBLE1BQU0sRUFBRSxLQUFWO0FBQWlCQyxJQUFBQSxLQUFLLEVBQUVaLE1BQU0sQ0FBQ2EsYUFBUCxJQUF3QjtBQUFoRCxHQUFoQixDQUFSO0FBQ0FWLEVBQUFBLEdBQUcsQ0FBQ0ksR0FBSixDQUFRVCxRQUFRLENBQUNFLE1BQUQsQ0FBaEIsRUF4QjZFLENBeUI3RTs7QUFDQUcsRUFBQUEsR0FBRyxDQUFDSSxHQUFKLENBQVFWLGtCQUFSLEVBMUI2RSxDQTJCN0U7O0FBQ0EsdUJBQU9NLEdBQVA7QUFDQSx3QkFBSUEsR0FBSixFQUFTRixJQUFULEVBQWVDLE9BQWYsRUFBd0JGLE1BQXhCO0FBQ0Esd0JBQVFHLEdBQVIsRUFBYUYsSUFBYjtBQUNBLHVCQUFPRSxHQUFQLEVBQVlGLElBQVosRUFBa0JDLE9BQWxCO0FBQ0EscUJBQUtDLEdBQUwsRUFBVUYsSUFBVixFQUFnQkQsTUFBaEI7QUFDQSx5QkFBU0csR0FBVCxFQUFjRixJQUFkLEVBQW9CQyxPQUFwQjtBQUNBLHdCQUFRQyxHQUFSLEVBQWFGLElBQWIsRUFBbUJDLE9BQW5CLEVBQTRCRixNQUE1QjtBQUNBLHFCQUFLRyxHQUFMO0FBQ0Esc0JBQU1BLEdBQU4sRUFBV0QsT0FBWDs7QUFDQSxNQUFJWSxnQkFBRUMsR0FBRixDQUFNZixNQUFOLEVBQWMsbUJBQWQsTUFBdUMsSUFBM0MsRUFBaUQ7QUFDL0Msd0JBQU1HLEdBQU4sRUFBV0YsSUFBWCxFQUFpQkMsT0FBakIsRUFBMEJGLE1BQTFCO0FBQ0Q7O0FBQ0QsU0FBT0csR0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUF1dGgsIElTdG9yYWdlSGFuZGxlciB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJ0B2ZXJkYWNjaW8vdHlwZXMnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgd2hvYW1pIGZyb20gJy4vYXBpL3dob2FtaSc7XG5pbXBvcnQgcGluZyBmcm9tICcuL2FwaS9waW5nJztcbmltcG9ydCB1c2VyIGZyb20gJy4vYXBpL3VzZXInO1xuaW1wb3J0IGRpc3RUYWdzIGZyb20gJy4vYXBpL2Rpc3QtdGFncyc7XG5pbXBvcnQgcHVibGlzaCBmcm9tICcuL2FwaS9wdWJsaXNoJztcbmltcG9ydCBzZWFyY2ggZnJvbSAnLi9hcGkvc2VhcmNoJztcbmltcG9ydCBwa2cgZnJvbSAnLi9hcGkvcGFja2FnZSc7XG5pbXBvcnQgc3RhcnMgZnJvbSAnLi9hcGkvc3RhcnMnO1xuaW1wb3J0IHByb2ZpbGUgZnJvbSAnLi9hcGkvdjEvcHJvZmlsZSc7XG5pbXBvcnQgdG9rZW4gZnJvbSAnLi9hcGkvdjEvdG9rZW4nO1xuXG5jb25zdCB7IG1hdGNoLCB2YWxpZGF0ZU5hbWUsIHZhbGlkYXRlUGFja2FnZSwgZW5jb2RlU2NvcGVQYWNrYWdlLCBhbnRpTG9vcCB9ID0gcmVxdWlyZSgnLi4vbWlkZGxld2FyZScpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjb25maWc6IENvbmZpZywgYXV0aDogSUF1dGgsIHN0b3JhZ2U6IElTdG9yYWdlSGFuZGxlcikge1xuICAvKiBlc2xpbnQgbmV3LWNhcDpvZmYgKi9cbiAgY29uc3QgYXBwID0gZXhwcmVzcy5Sb3V0ZXIoKTtcbiAgLyogZXNsaW50IG5ldy1jYXA6b2ZmICovXG5cbiAgLy8gdmFsaWRhdGUgYWxsIG9mIHRoZXNlIHBhcmFtcyBhcyBhIHBhY2thZ2UgbmFtZVxuICAvLyB0aGlzIG1pZ2h0IGJlIHRvbyBoYXJzaCwgc28gYXNrIGlmIGl0IGNhdXNlcyB0cm91YmxlXG4gIC8vICRGbG93Rml4TWVcbiAgYXBwLnBhcmFtKCdwYWNrYWdlJywgdmFsaWRhdGVQYWNrYWdlKTtcbiAgLy8gJEZsb3dGaXhNZVxuICBhcHAucGFyYW0oJ2ZpbGVuYW1lJywgdmFsaWRhdGVOYW1lKTtcbiAgYXBwLnBhcmFtKCd0YWcnLCB2YWxpZGF0ZU5hbWUpO1xuICBhcHAucGFyYW0oJ3ZlcnNpb24nLCB2YWxpZGF0ZU5hbWUpO1xuICBhcHAucGFyYW0oJ3JldmlzaW9uJywgdmFsaWRhdGVOYW1lKTtcbiAgYXBwLnBhcmFtKCd0b2tlbicsIHZhbGlkYXRlTmFtZSk7XG5cbiAgLy8gdGhlc2UgY2FuJ3QgYmUgc2FmZWx5IHB1dCBpbnRvIGV4cHJlc3MgdXJsIGZvciBzb21lIHJlYXNvblxuICAvLyBUT0RPOiBGb3Igc29tZSByZWFzb24/IHdoYXQgcmVhc29uP1xuICBhcHAucGFyYW0oJ19yZXYnLCBtYXRjaCgvXi1yZXYkLykpO1xuICBhcHAucGFyYW0oJ29yZ19jb3VjaGRiX3VzZXInLCBtYXRjaCgvXm9yZ1xcLmNvdWNoZGJcXC51c2VyOi8pKTtcbiAgYXBwLnBhcmFtKCdhbnl0aGluZycsIG1hdGNoKC8uKi8pKTtcblxuICBhcHAudXNlKGF1dGguYXBpSldUbWlkZGxld2FyZSgpKTtcbiAgYXBwLnVzZShib2R5UGFyc2VyLmpzb24oeyBzdHJpY3Q6IGZhbHNlLCBsaW1pdDogY29uZmlnLm1heF9ib2R5X3NpemUgfHwgJzEwbWInIH0pKTtcbiAgYXBwLnVzZShhbnRpTG9vcChjb25maWcpKTtcbiAgLy8gZW5jb2RlIC8gaW4gYSBzY29wZWQgcGFja2FnZSBuYW1lIHRvIGJlIG1hdGNoZWQgYXMgYSBzaW5nbGUgcGFyYW1ldGVyIGluIHJvdXRlc1xuICBhcHAudXNlKGVuY29kZVNjb3BlUGFja2FnZSk7XG4gIC8vIGZvciBcIm5wbSB3aG9hbWlcIlxuICB3aG9hbWkoYXBwKTtcbiAgcGtnKGFwcCwgYXV0aCwgc3RvcmFnZSwgY29uZmlnKTtcbiAgcHJvZmlsZShhcHAsIGF1dGgpO1xuICBzZWFyY2goYXBwLCBhdXRoLCBzdG9yYWdlKTtcbiAgdXNlcihhcHAsIGF1dGgsIGNvbmZpZyk7XG4gIGRpc3RUYWdzKGFwcCwgYXV0aCwgc3RvcmFnZSk7XG4gIHB1Ymxpc2goYXBwLCBhdXRoLCBzdG9yYWdlLCBjb25maWcpO1xuICBwaW5nKGFwcCk7XG4gIHN0YXJzKGFwcCwgc3RvcmFnZSk7XG4gIGlmIChfLmdldChjb25maWcsICdleHBlcmltZW50cy50b2tlbicpID09PSB0cnVlKSB7XG4gICAgdG9rZW4oYXBwLCBhdXRoLCBzdG9yYWdlLCBjb25maWcpO1xuICB9XG4gIHJldHVybiBhcHA7XG59XG4iXX0=