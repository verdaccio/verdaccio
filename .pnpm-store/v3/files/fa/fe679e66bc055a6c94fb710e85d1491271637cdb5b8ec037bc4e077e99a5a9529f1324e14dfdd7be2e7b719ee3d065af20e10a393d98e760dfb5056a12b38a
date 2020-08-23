"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _request = _interopRequireDefault(require("request"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ProxyAudit {
  constructor(config, options) {
    _defineProperty(this, "enabled", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "strict_ssl", void 0);

    this.enabled = config.enabled || false;
    this.strict_ssl = config.strict_ssl !== undefined ? config.strict_ssl : true;
    this.logger = options.logger;
  }

  register_middlewares(app, auth) {
    const fetchAudit = (req, res) => {
      const headers = req.headers;
      headers.host = 'https://registry.npmjs.org/';
      const requestOptions = {
        url: 'https://registry.npmjs.org/-/npm/v1/security/audits',
        method: req.method,
        proxy: auth.config.https_proxy,
        req,
        strictSSL: this.strict_ssl
      };
      req.pipe((0, _request.default)(requestOptions)).on('error', err => {
        if (typeof res.report_error === 'function') {
          return res.report_error(err);
        }

        this.logger.error(err);
        return res.status(500).end();
      }).pipe(res);
    };

    const handleAudit = (req, res) => {
      if (this.enabled) {
        fetchAudit(req, res);
      } else {
        res.status(500).end();
      }
    };
    /* eslint new-cap:off */


    const router = _express.default.Router();
    /* eslint new-cap:off */


    router.post('/audits', handleAudit);
    router.post('/audits/quick', handleAudit);
    app.use('/-/npm/v1/security', router);
  }

}

exports.default = ProxyAudit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdWRpdC50cyJdLCJuYW1lcyI6WyJQcm94eUF1ZGl0IiwiY29uc3RydWN0b3IiLCJjb25maWciLCJvcHRpb25zIiwiZW5hYmxlZCIsInN0cmljdF9zc2wiLCJ1bmRlZmluZWQiLCJsb2dnZXIiLCJyZWdpc3Rlcl9taWRkbGV3YXJlcyIsImFwcCIsImF1dGgiLCJmZXRjaEF1ZGl0IiwicmVxIiwicmVzIiwiaGVhZGVycyIsImhvc3QiLCJyZXF1ZXN0T3B0aW9ucyIsInVybCIsIm1ldGhvZCIsInByb3h5IiwiaHR0cHNfcHJveHkiLCJzdHJpY3RTU0wiLCJwaXBlIiwib24iLCJlcnIiLCJyZXBvcnRfZXJyb3IiLCJlcnJvciIsInN0YXR1cyIsImVuZCIsImhhbmRsZUF1ZGl0Iiwicm91dGVyIiwiZXhwcmVzcyIsIlJvdXRlciIsInBvc3QiLCJ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7O0FBS2UsTUFBTUEsVUFBTixDQUEyRDtBQUtqRUMsRUFBQUEsV0FBUCxDQUFtQkMsTUFBbkIsRUFBd0NDLE9BQXhDLEVBQTZFO0FBQUE7O0FBQUE7O0FBQUE7O0FBQzNFLFNBQUtDLE9BQUwsR0FBZUYsTUFBTSxDQUFDRSxPQUFQLElBQWtCLEtBQWpDO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQkgsTUFBTSxDQUFDRyxVQUFQLEtBQXNCQyxTQUF0QixHQUFrQ0osTUFBTSxDQUFDRyxVQUF6QyxHQUFzRCxJQUF4RTtBQUNBLFNBQUtFLE1BQUwsR0FBY0osT0FBTyxDQUFDSSxNQUF0QjtBQUNEOztBQUVNQyxFQUFBQSxvQkFBUCxDQUE0QkMsR0FBNUIsRUFBc0NDLElBQXRDLEVBQTJFO0FBQ3pFLFVBQU1DLFVBQVUsR0FBRyxDQUFDQyxHQUFELEVBQWVDLEdBQWYsS0FBcUU7QUFDdEYsWUFBTUMsT0FBTyxHQUFHRixHQUFHLENBQUNFLE9BQXBCO0FBQ0FBLE1BQUFBLE9BQU8sQ0FBQ0MsSUFBUixHQUFlLDZCQUFmO0FBRUEsWUFBTUMsY0FBYyxHQUFHO0FBQ3JCQyxRQUFBQSxHQUFHLEVBQUUscURBRGdCO0FBRXJCQyxRQUFBQSxNQUFNLEVBQUVOLEdBQUcsQ0FBQ00sTUFGUztBQUdyQkMsUUFBQUEsS0FBSyxFQUFFVCxJQUFJLENBQUNSLE1BQUwsQ0FBWWtCLFdBSEU7QUFJckJSLFFBQUFBLEdBSnFCO0FBS3JCUyxRQUFBQSxTQUFTLEVBQUUsS0FBS2hCO0FBTEssT0FBdkI7QUFRQU8sTUFBQUEsR0FBRyxDQUNBVSxJQURILENBQ1Esc0JBQVFOLGNBQVIsQ0FEUixFQUVHTyxFQUZILENBRU0sT0FGTixFQUVlQyxHQUFHLElBQUk7QUFDbEIsWUFBSSxPQUFPWCxHQUFHLENBQUNZLFlBQVgsS0FBNEIsVUFBaEMsRUFBNEM7QUFDMUMsaUJBQU9aLEdBQUcsQ0FBQ1ksWUFBSixDQUFpQkQsR0FBakIsQ0FBUDtBQUNEOztBQUNELGFBQUtqQixNQUFMLENBQVltQixLQUFaLENBQWtCRixHQUFsQjtBQUNBLGVBQU9YLEdBQUcsQ0FBQ2MsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLEdBQWhCLEVBQVA7QUFDRCxPQVJILEVBU0dOLElBVEgsQ0FTUVQsR0FUUjtBQVVELEtBdEJEOztBQXdCQSxVQUFNZ0IsV0FBVyxHQUFHLENBQUNqQixHQUFELEVBQWVDLEdBQWYsS0FBdUM7QUFDekQsVUFBSSxLQUFLVCxPQUFULEVBQWtCO0FBQ2hCTyxRQUFBQSxVQUFVLENBQUNDLEdBQUQsRUFBTUMsR0FBTixDQUFWO0FBQ0QsT0FGRCxNQUVPO0FBQ0xBLFFBQUFBLEdBQUcsQ0FBQ2MsTUFBSixDQUFXLEdBQVgsRUFBZ0JDLEdBQWhCO0FBQ0Q7QUFDRixLQU5EO0FBUUE7OztBQUNBLFVBQU1FLE1BQU0sR0FBR0MsaUJBQVFDLE1BQVIsRUFBZjtBQUNBOzs7QUFDQUYsSUFBQUEsTUFBTSxDQUFDRyxJQUFQLENBQVksU0FBWixFQUF1QkosV0FBdkI7QUFFQUMsSUFBQUEsTUFBTSxDQUFDRyxJQUFQLENBQVksZUFBWixFQUE2QkosV0FBN0I7QUFFQXBCLElBQUFBLEdBQUcsQ0FBQ3lCLEdBQUosQ0FBUSxvQkFBUixFQUE4QkosTUFBOUI7QUFDRDs7QUFwRHVFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdCc7XG5pbXBvcnQgZXhwcmVzcywgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgTG9nZ2VyLCBJUGx1Z2luTWlkZGxld2FyZSwgSUJhc2ljQXV0aCwgUGx1Z2luT3B0aW9ucyB9IGZyb20gJ0B2ZXJkYWNjaW8vdHlwZXMnO1xuXG5pbXBvcnQgeyBDb25maWdBdWRpdCB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm94eUF1ZGl0IGltcGxlbWVudHMgSVBsdWdpbk1pZGRsZXdhcmU8Q29uZmlnQXVkaXQ+IHtcbiAgcHVibGljIGVuYWJsZWQ6IGJvb2xlYW47XG4gIHB1YmxpYyBsb2dnZXI6IExvZ2dlcjtcbiAgcHVibGljIHN0cmljdF9zc2w6IGJvb2xlYW47XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnQXVkaXQsIG9wdGlvbnM6IFBsdWdpbk9wdGlvbnM8Q29uZmlnQXVkaXQ+KSB7XG4gICAgdGhpcy5lbmFibGVkID0gY29uZmlnLmVuYWJsZWQgfHwgZmFsc2U7XG4gICAgdGhpcy5zdHJpY3Rfc3NsID0gY29uZmlnLnN0cmljdF9zc2wgIT09IHVuZGVmaW5lZCA/IGNvbmZpZy5zdHJpY3Rfc3NsIDogdHJ1ZTtcbiAgICB0aGlzLmxvZ2dlciA9IG9wdGlvbnMubG9nZ2VyO1xuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyX21pZGRsZXdhcmVzKGFwcDogYW55LCBhdXRoOiBJQmFzaWNBdXRoPENvbmZpZ0F1ZGl0Pik6IHZvaWQge1xuICAgIGNvbnN0IGZldGNoQXVkaXQgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlICYgeyByZXBvcnRfZXJyb3I/OiBGdW5jdGlvbiB9KTogdm9pZCA9PiB7XG4gICAgICBjb25zdCBoZWFkZXJzID0gcmVxLmhlYWRlcnM7XG4gICAgICBoZWFkZXJzLmhvc3QgPSAnaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvJztcblxuICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAgIHVybDogJ2h0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnLy0vbnBtL3YxL3NlY3VyaXR5L2F1ZGl0cycsXG4gICAgICAgIG1ldGhvZDogcmVxLm1ldGhvZCxcbiAgICAgICAgcHJveHk6IGF1dGguY29uZmlnLmh0dHBzX3Byb3h5LFxuICAgICAgICByZXEsXG4gICAgICAgIHN0cmljdFNTTDogdGhpcy5zdHJpY3Rfc3NsLFxuICAgICAgfTtcblxuICAgICAgcmVxXG4gICAgICAgIC5waXBlKHJlcXVlc3QocmVxdWVzdE9wdGlvbnMpKVxuICAgICAgICAub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIHJlcy5yZXBvcnRfZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMucmVwb3J0X2Vycm9yKGVycik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5lbmQoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnBpcGUocmVzKTtcbiAgICB9O1xuXG4gICAgY29uc3QgaGFuZGxlQXVkaXQgPSAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKTogdm9pZCA9PiB7XG4gICAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICAgIGZldGNoQXVkaXQocmVxLCByZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmVuZCgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKiBlc2xpbnQgbmV3LWNhcDpvZmYgKi9cbiAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xuICAgIC8qIGVzbGludCBuZXctY2FwOm9mZiAqL1xuICAgIHJvdXRlci5wb3N0KCcvYXVkaXRzJywgaGFuZGxlQXVkaXQpO1xuXG4gICAgcm91dGVyLnBvc3QoJy9hdWRpdHMvcXVpY2snLCBoYW5kbGVBdWRpdCk7XG5cbiAgICBhcHAudXNlKCcvLS9ucG0vdjEvc2VjdXJpdHknLCByb3V0ZXIpO1xuICB9XG59XG4iXX0=