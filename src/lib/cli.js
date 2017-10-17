#!/usr/bin/env node

/* eslint no-sync:0 */
/* eslint no-empty:0 */
'use strict';

const _ = require('lodash');

if (process.getuid && process.getuid() === 0) {
  global.console.error('Verdaccio doesn\'t need superuser privileges. Don\'t run it under root.');
}

process.title = 'verdaccio';

try {
  // for debugging memory leaks
  // totally optional
  require('heapdump');
} catch(err) { }

const logger = require('./logger');
logger.setup(); // default setup

const commander = require('commander');
const constants = require('constants');
const fs = require('fs');
const http = require('http');
const https = require('https');
const Path = require('path');
const URL = require('url');
const server = require('../api/index');
const Utils = require('./utils');
const pkginfo = require('pkginfo')(module); // eslint-disable-line no-unused-vars
const pkgVersion = module.exports.version;
const pkgName = module.exports.name;

commander
  .option('-l, --listen <[host:]port>', 'host:port number to listen on (default: localhost:4873)')
  .option('-c, --config <config.yaml>', 'use this configuration file (default: ./config.yaml)')
  .version(pkgVersion)
  .parse(process.argv);

if (commander.args.length == 1 && !commander.config) {
  // handling "verdaccio [config]" case if "-c" is missing in commandline
  commander.config = commander.args.pop();
}

if (commander.args.length != 0) {
  commander.help();
}

let config;
let config_path;
try {
  if (commander.config) {
    config_path = Path.resolve(commander.config);
  } else {
    config_path = require('./config-path')();
  }
  config = Utils.parseConfigFile(config_path);
  logger.logger.warn({file: config_path}, 'config file  - @{file}');
} catch (err) {
  logger.logger.fatal({file: config_path, err: err}, 'cannot open config file @{file}: @{!err.message}');
  process.exit(1);
}

afterConfigLoad();

/**
 * Retrieve all addresses defined in the config file.
 * Verdaccio is able to listen multiple ports
 * eg:
 *  listen:
    - localhost:5555
    - localhost:5557
    @return {Array}
 */
function get_listen_addresses() {
  // command line || config file || default
  let addresses;
  if (commander.listen) {
    addresses = [commander.listen];
  } else if (Array.isArray(config.listen)) {
    addresses = config.listen;
  } else if (config.listen) {
    addresses = [config.listen];
  } else {
    addresses = ['4873'];
  }
  addresses = addresses.map(function(addr) {
    let parsed_addr = Utils.parse_address(addr);

    if (!parsed_addr) {
      logger.logger.warn({addr: addr},
         'invalid address - @{addr}, we expect a port (e.g. "4873"),'
       + ' host:port (e.g. "localhost:4873") or full url'
       + ' (e.g. "http://localhost:4873/")');
    }

    return parsed_addr;
  }).filter(Boolean);

  return addresses;
}

/**
 * Trigger the server after configuration has been loaded.
 */
function afterConfigLoad() {
  if (!config.self_path) {
    config.self_path = Path.resolve(config_path);
  }
  if (!config.https) {
    config.https = {enable: false};
  }
  const app = server(config);
  get_listen_addresses().forEach(function(addr) {
    let webServer;
    if (addr.proto === 'https') { // https  must either have key cert and ca  or a pfx and (optionally) a passphrase
      if (!config.https || !((config.https.key && config.https.cert && config.https.ca) || config.https.pfx)) {
        let conf_path = function(file) {
          if (!file) return config_path;
          return Path.resolve(Path.dirname(config_path), file);
        };

        logger.logger.fatal([
          'You need to specify either '
          '    "https.key", "https.cert" and "https.ca" or '
          '    "https.pfx" and optionally "https.passphrase" '
          'to run https server',
          '',
          // commands are borrowed from node.js docs
          'To quickly create self-signed certificate, use:',
          ' $ openssl genrsa -out ' + conf_path('verdaccio-key.pem') + ' 2048',
          ' $ openssl req -new -sha256 -key ' + conf_path('verdaccio-key.pem') + ' -out ' + conf_path('verdaccio-csr.pem'),
          ' $ openssl x509 -req -in ' + conf_path('verdaccio-csr.pem') +
          ' -signkey ' + conf_path('verdaccio-key.pem') + ' -out ' + conf_path('verdaccio-cert.pem'),
          '',
          'And then add to config file (' + conf_path() + '):',
          '  https:',
          '    key: verdaccio-key.pem',
          '    cert: verdaccio-cert.pem',
          '    ca: verdaccio-cert.pem',
        ].join('\n'));
        process.exit(2);
      }

      try {
        var httpsoptions = {
          secureProtocol: 'SSLv23_method', // disable insecure SSLv2 and SSLv3
          secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3
        };

        if (config.https.pfx) {
          httpsoptions.pfx = fs.readFileSync(config.https.pfx);
          httpsoptions.passphrase = config.https.passphrase || "";
        } else {
          httpsoptions.key = fs.readFileSync(config.https.key);
          httpsoptions.cert = fs.readFileSync(config.https.cert);
          httpsoptions.ca = fs.readFileSync(config.https.ca);
        }


        webServer = https.createServer(httpsoptions, app);
      } catch (err) { // catch errors related to certificate loading
        logger.logger.fatal({err: err}, 'cannot create server: @{err.message}');
        process.exit(2);
      }
    } else { // http
      webServer = http.createServer(app);
    }

    webServer
      .listen(addr.port || addr.path, addr.host)
      .on('error', function(err) {
        logger.logger.fatal({err: err}, 'cannot create server: @{err.message}');
        process.exit(2);
      });

    logger.logger.warn({
      addr: ( addr.path
            ? URL.format({
                protocol: 'unix',
                pathname: addr.path,
              })
            : URL.format({
                protocol: addr.proto,
                hostname: addr.host,
                port: addr.port,
                pathname: '/',
              })
            ),
      version: pkgName + '/' + pkgVersion,
    }, 'http address - @{addr} - @{version}');
  });

  // undocumented stuff for tests
  if (_.isFunction(process.send)) {
    process.send({
      verdaccio_started: true,
    });
  }
}

process.on('uncaughtException', function(err) {
  logger.logger.fatal( {
      err: err,
    },
  'uncaught exception, please report this\n@{err.stack}' );
  process.exit(255);
});
