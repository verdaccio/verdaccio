#!/usr/bin/env node

/*eslint no-sync:0*/

if (process.getuid && process.getuid() === 0) {
  global.console.error("Sinopia doesn't need superuser privileges. Don't run it under root.")
}

process.title = 'sinopia'
require('es6-shim')

try {
  // for debugging memory leaks
  // totally optional
  require('heapdump')
} catch(err) {}

var logger = require('./logger')
logger.setup() // default setup

var commander = require('commander')
var constants = require('constants')
var fs        = require('fs')
var http      = require('http')
var https     = require('https')
var YAML      = require('js-yaml')
var Path      = require('path')
var URL       = require('url')
var server    = require('./index')
var Utils     = require('./utils')
var pkginfo = require('pkginfo')(module); // eslint-disable-line no-unused-vars
var pkgVersion = module.exports.version
var pkgName    = module.exports.name

commander
  .option('-l, --listen <[host:]port>', 'host:port number to listen on (default: localhost:4873)')
  .option('-c, --config <config.yaml>', 'use this configuration file (default: ./config.yaml)')
  .version(pkgVersion)
  .parse(process.argv)

if (commander.args.length == 1 && !commander.config) {
  // handling "sinopia [config]" case if "-c" is missing in commandline
  commander.config = commander.args.pop()
}

if (commander.args.length != 0) {
  commander.help()
}

var config, config_path
try {
  if (commander.config) {
    config_path = Path.resolve(commander.config)
  } else {
    config_path = require('./config-path')()
  }
  config = YAML.safeLoad(fs.readFileSync(config_path, 'utf8'))
  logger.logger.warn({ file: config_path }, 'config file  - @{file}')
} catch (err) {
  logger.logger.fatal({ file: config_path, err: err }, 'cannot open config file @{file}: @{!err.message}')
  process.exit(1)
}

afterConfigLoad()

function get_listen_addresses() {
  // command line || config file || default
  var addresses

  if (commander.listen) {
    addresses = [ commander.listen ]
  } else if (Array.isArray(config.listen)) {
    addresses = config.listen
  } else if (config.listen) {
    addresses = [ config.listen ]
  } else {
    addresses = [ '4873' ]
  }

  addresses = addresses.map(function(addr) {
    var parsed_addr = Utils.parse_address(addr)

    if (!parsed_addr) {
      logger.logger.warn({ addr: addr },
         'invalid address - @{addr}, we expect a port (e.g. "4873"),'
       + ' host:port (e.g. "localhost:4873") or full url'
       + ' (e.g. "http://localhost:4873/")')
    }

    return parsed_addr

  }).filter(Boolean)

  return addresses
}

function afterConfigLoad() {
  if (!config.self_path) config.self_path = Path.resolve(config_path)
  if (!config.https) config.https = { enable: false };

  var app = server(config)

  get_listen_addresses().forEach(function(addr) {
    var webServer

    if (addr.proto === 'https') { // https
      if (!config.https || !config.https.key || !config.https.cert) {
        var conf_path = function(file) {
          if (!file) return config_path
          return Path.resolve(Path.dirname(config_path), file)
        }

        logger.logger.fatal([
          'You need to specify "https.key" and "https.cert" to run https server',
          '',
          // commands are borrowed from node.js docs
          'To quickly create self-signed certificate, use:',
          ' $ openssl genrsa -out ' + conf_path('sinopia-key.pem') + ' 2048',
          ' $ openssl req -new -sha256 -key ' + conf_path('sinopia-key.pem') + ' -out ' + conf_path('sinopia-csr.pem'),
          ' $ openssl x509 -req -in ' + conf_path('sinopia-csr.pem') + ' -signkey ' + conf_path('sinopia-key.pem') + ' -out ' + conf_path('sinopia-cert.pem'),
          '',
          'And then add to config file (' + conf_path() + '):',
          '  https:',
          '    key: sinopia-key.pem',
          '    cert: sinopia-cert.pem',
        ].join('\n'))
        process.exit(2)
      }

      try {
        webServer = https.createServer({
          secureProtocol: 'SSLv23_method', // disable insecure SSLv2 and SSLv3
          secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3,
          key: fs.readFileSync(config.https.key),
          cert: fs.readFileSync(config.https.cert)
        }, app)
      } catch (err) { // catch errors related to certificate loading
        logger.logger.fatal({ err: err }, 'cannot create server: @{err.message}')
        process.exit(2)
      }
    } else { // http
      webServer = http.createServer(app);
    }

    webServer
      .listen(addr.port || addr.path, addr.host)
      .on('error', function(err) {
        logger.logger.fatal({ err: err }, 'cannot create server: @{err.message}')
        process.exit(2)
      })

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
    }, 'http address - @{addr}')
  })

  // undocumented stuff for tests
  if (typeof(process.send) === 'function') {
    process.send({ sinopia_started: true })
  }
}

process.on('uncaughtException', function(err) {
  logger.logger.fatal( { err: err }
                     , 'uncaught exception, please report this\n@{err.stack}' )
  process.exit(255)
})

