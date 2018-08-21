'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenDefaultCallback = exports.startVerdaccio = undefined;
exports.getListListenAddresses = getListListenAddresses;

var _lodash = require('lodash');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _constants = require('constants');

var _constants2 = _interopRequireDefault(_constants);

var _index = require('../api/index');

var _index2 = _interopRequireDefault(_index);

var _utils = require('./utils');

var _constants3 = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// $FlowFixMe
const logger = require('./logger');

/**
 * Retrieve all addresses defined in the config file.
 * Verdaccio is able to listen multiple ports
 * @param {String} argListen
 * @param {String} configListen
 * eg:
 *  listen:
    - localhost:5555
    - localhost:5557
    @return {Array}
 */
function getListListenAddresses(argListen, configListen) {
  // command line || config file || default
  let addresses;
  if (argListen) {
    addresses = [argListen];
  } else if (Array.isArray(configListen)) {
    addresses = configListen;
  } else if (configListen) {
    addresses = [configListen];
  } else {
    addresses = [_constants3.DEFAULT_PORT];
  }
  addresses = addresses.map(function (addr) {
    const parsedAddr = (0, _utils.parse_address)(addr);

    if (!parsedAddr) {
      logger.logger.warn({ addr: addr }, 'invalid address - @{addr}, we expect a port (e.g. "4873"),' + ' host:port (e.g. "localhost:4873") or full url' + ' (e.g. "http://localhost:4873/")');
    }

    return parsedAddr;
  }).filter(Boolean);

  return addresses;
}

/**
 * Trigger the server after configuration has been loaded.
 * @param {Object} config
 * @param {Object} cliArguments
 * @param {String} configPath
 * @param {String} pkgVersion
 * @param {String} pkgName
 */
function startVerdaccio(config, cliListen, configPath, pkgVersion, pkgName, callback) {
  if ((0, _lodash.isObject)(config) === false) {
    throw new Error('config file must be an object');
  }

  (0, _index2.default)(config).then(app => {
    const addresses = getListListenAddresses(cliListen, config.listen);

    addresses.forEach(function (addr) {
      let webServer;
      if (addr.proto === 'https') {
        // https  must either have key cert and ca  or a pfx and (optionally) a passphrase
        if (!config.https || !config.https.key || !config.https.cert || !config.https.ca) {
          displayHTTPSWarning(configPath);
        }

        webServer = handleHTTPS(app, configPath, config);
      } else {
        // http
        webServer = _http2.default.createServer(app);
      }

      unlinkAddressPath(addr);

      callback(webServer, addr, pkgName, pkgVersion);
    });
  });
}

function unlinkAddressPath(addr) {
  if (addr.path && _fs2.default.existsSync(addr.path)) {
    _fs2.default.unlinkSync(addr.path);
  }
}

function displayHTTPSWarning(storageLocation) {
  const resolveConfigPath = function (file) {
    return _path2.default.resolve(_path2.default.dirname(storageLocation), file);
  };

  logger.logger.fatal(['You have enabled HTTPS and need to specify either ', '    "https.key", "https.cert" and "https.ca" or ', '    "https.pfx" and optionally "https.passphrase" ', 'to run https server', '',
  // commands are borrowed from node.js docs
  'To quickly create self-signed certificate, use:', ' $ openssl genrsa -out ' + resolveConfigPath('verdaccio-key.pem') + ' 2048', ' $ openssl req -new -sha256 -key ' + resolveConfigPath('verdaccio-key.pem') + ' -out ' + resolveConfigPath('verdaccio-csr.pem'), ' $ openssl x509 -req -in ' + resolveConfigPath('verdaccio-csr.pem') + ' -signkey ' + resolveConfigPath('verdaccio-key.pem') + ' -out ' + resolveConfigPath('verdaccio-cert.pem'), '', 'And then add to config file (' + storageLocation + '):', '  https:', `    key: ${resolveConfigPath('verdaccio-key.pem')}`, `    cert: ${resolveConfigPath('verdaccio-cert.pem')}`, `    ca: ${resolveConfigPath('verdaccio-csr.pem')}`].join('\n'));
  process.exit(2);
}

function handleHTTPS(app, configPath, config) {
  try {
    let httpsOptions = {
      secureProtocol: 'SSLv23_method', // disable insecure SSLv2 and SSLv3
      secureOptions: _constants2.default.SSL_OP_NO_SSLv2 | _constants2.default.SSL_OP_NO_SSLv3
    };

    if (config.https.pfx) {
      httpsOptions = (0, _lodash.assign)(httpsOptions, {
        pfx: _fs2.default.readFileSync(config.https.pfx),
        passphrase: config.https.passphrase || ''
      });
    } else {
      httpsOptions = (0, _lodash.assign)(httpsOptions, {
        key: _fs2.default.readFileSync(config.https.key),
        cert: _fs2.default.readFileSync(config.https.cert),
        ca: _fs2.default.readFileSync(config.https.ca)
      });
    }
    return _https2.default.createServer(httpsOptions, app);
  } catch (err) {
    // catch errors related to certificate loading
    logger.logger.fatal({ err: err }, 'cannot create server: @{err.message}');
    process.exit(2);
  }
}

function listenDefaultCallback(webServer, addr, pkgName, pkgVersion) {
  webServer.listen(addr.port || addr.path, addr.host, () => {
    // send a message for tests
    if ((0, _lodash.isFunction)(process.send)) {
      process.send({
        verdaccio_started: true
      });
    }
    // $FlowFixMe
  }).on('error', function (err) {
    logger.logger.fatal({ err: err }, 'cannot create server: @{err.message}');
    process.exit(2);
  });

  logger.logger.warn({
    addr: addr.path ? _url2.default.format({
      protocol: 'unix',
      pathname: addr.path
    }) : _url2.default.format({
      protocol: addr.proto,
      hostname: addr.host,
      port: addr.port,
      pathname: '/'
    }),
    version: pkgName + '/' + pkgVersion
  }, 'http address - @{addr} - @{version}');
}

exports.startVerdaccio = startVerdaccio;
exports.listenDefaultCallback = listenDefaultCallback;