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
var server    = require('./index')
var pkg_file  = '../package.yaml'
var pkg       = YAML.safeLoad(fs.readFileSync(__dirname+'/'+ pkg_file, 'utf8'))

commander
  .option('-l, --listen <[host:]port>', 'host:port number to listen on (default: localhost:4873)')
  .option('-c, --config <config.yaml>', 'use this configuration file (default: ./config.yaml)')
  .version(pkg.version)
  .parse(process.argv)

if (commander.args.length == 1 && !commander.config) {
  // handling "sinopia [config]" case if "-c" is missing in commandline
  commander.config = commander.args.pop()
}

if (commander.args.length != 0) {
  commander.help()
}

var config, config_path, have_question
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

function get_hostport() {
  // command line || config file || default
  var hostport = commander.listen || String(config.listen || '') || '4873'

  hostport = hostport.split(':')
  if (hostport.length < 2) {
    hostport = [ undefined, hostport[0] ]
  }
  if (hostport[0] == null) {
    hostport[0] = 'localhost'
  }
  return hostport
}

function afterConfigLoad() {
  if (!config.self_path) config.self_path = Path.resolve(config_path)
  if (!config.https) config.https = { enable: false };

  var hostport = get_hostport()
  var app = server(config);
  var webServer;

  if (config.https.enable === true) { // https
    try {
      webServer = https.createServer({
          secureProtocol: 'SSLv23_method', // disable insecure SSLv2 and SSLv3
          secureOptions: constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3,
          key: fs.readFileSync(config.https.key),
          cert: fs.readFileSync(config.https.cert)
        }, app);
    } catch (err) { // catch errors related to certificate loading
      logger.logger.fatal({err: err}, 'cannot create server: @{err.message}')
      process.exit(2)
    }
  } else { // http
    webServer = http.createServer(app);
  }

  webServer
    .listen(hostport[1], hostport[0])
    .on('error', function(err) {
      logger.logger.fatal({ err: err }, 'cannot create server: @{err.message}')
      process.exit(2)
    })

  logger.logger.warn({
    addr: (config.https.enable === true ? 'https' : 'http') + '://'+hostport[0]+':'+hostport[1]+'/',
    version: 'Sinopia/'+pkg.version,
  }, 'http address - @{addr}')

  // undocumented stuff for tests
  if (typeof(process.send) === 'function') {
    process.send({ sinopia_started: hostport })
  }
}

process.on('uncaughtException', function(err) {
  logger.logger.fatal( { err: err }
                     , 'uncaught exception, please report this\n@{err.stack}' )
  process.exit(255)
})

