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
var fs        = require('fs')
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
    config_path = commander.config
    config = YAML.safeLoad(fs.readFileSync(config_path, 'utf8'))
  } else {
    config_path = './config.yaml'
    try {
      config = YAML.safeLoad(fs.readFileSync(config_path, 'utf8'))
    } catch(err) {
      var readline = require('readline')
      var rl = readline.createInterface(process.stdin, process.stdout)
      var timeout = setTimeout(function() {
        global.console.log('I got tired waiting for an answer. Exitting...')
        process.exit(1)
      }, 20000)

      ;(function askUser() {
        have_question = true
        rl.question('Config file doesn\'t exist, create a new one? (Y/n) ', function(x) {
          clearTimeout(timeout)
          if (x[0] == 'Y' || x[0] == 'y' || x === '') {
            rl.close()

            var created_config = require('../lib/config_gen')()
            config = YAML.safeLoad(created_config.yaml)
            write_config_banner(created_config, config)
            fs.writeFileSync(config_path, created_config.yaml)
            afterConfigLoad()
          } else if (x[0] == 'N' || x[0] == 'n') {
            rl.close()
            global.console.log('So, you just accidentally run me in a wrong folder. Exitting...')
            process.exit(1)
          } else {
            askUser()
          }
        })
      })()
    }
  }
} catch (err) {
  logger.logger.fatal({ file: config_path, err: err }, 'cannot open config file @{file}: @{!err.message}')
  process.exit(1)
}

if (!have_question) afterConfigLoad()

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
  if (!config.user_agent) config.user_agent = 'Sinopia/'+pkg.version
  if (!config.self_path) config.self_path = Path.resolve(config_path)

  logger.setup(config.logs)

  var hostport = get_hostport()
  server(config)
    .listen(hostport[1], hostport[0])
    .on('error', function(err) {
      logger.logger.fatal({ err: err }, 'cannot create server: @{err.message}')
      process.exit(2)
    })

  logger.logger.warn({ addr: 'http://'+hostport[0]+':'+hostport[1]+'/', version: 'Sinopia/'+pkg.version }, 'Server is listening on @{addr}')

  // undocumented stuff for tests
  if (typeof(process.send) === 'function') {
    process.send({ sinopia_started: hostport })
  }
}

function write_config_banner(def, config) {
  var hostport = get_hostport()
  var log = global.console.log

  log('===========================================================')
  log(' Creating a new configuration file: "%s"', config_path)
  log(' ')
  log(' If you want to setup npm to work with this registry,')
  log(' run following commands:')
  log(' ')
  log(' $ npm set registry http://%s:%s/', hostport[0], hostport[1])
  log(' $ npm set always-auth true')
  log(' $ npm adduser')
  log('   Username: %s', def.user)
  log('   Password: %s', def.pass)
  log('===========================================================')
}

process.on('uncaughtException', function(err) {
  logger.logger.fatal( { err: err }
                     , 'uncaught exception, please report this\n@{err.stack}' )
  process.exit(255)
})

