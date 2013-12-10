#!/usr/bin/env node

var logger = require('./logger')
logger.setup() // default setup

var pkg_file = '../package.yaml'
  , fs = require('fs')
  , yaml = require('js-yaml')
  , commander = require('commander')
  , server = require('./index')
  , crypto = require('crypto')
  , pkg = require(pkg_file)

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
		config = yaml.safeLoad(fs.readFileSync(config_path, 'utf8'))
	} else {
		config_path = './config.yaml'
		try {
			config = yaml.safeLoad(fs.readFileSync(config_path, 'utf8'))
		} catch(err) {
			var readline = require('readline')
			var rl = readline.createInterface(process.stdin, process.stdout)
			var timeout = setTimeout(function() {
				console.log('I got tired waiting for an answer. Exitting...')
				process.exit(1)
			}, 20000)

			;(function askUser() {
				have_question = true
				rl.question('Config file doesn\'t exist, create a new one? (Y/n) ', function(x) {
					clearTimeout(timeout)
					if (x[0] == 'Y' || x[0] == 'y' || x === '') {
						rl.close()

						var created_config = require('../lib/config_gen')()
						config = yaml.safeLoad(created_config.yaml)
						write_config_banner(created_config, config)
						fs.writeFileSync(config_path, created_config.yaml)
						afterConfigLoad()
					} else if (x[0] == 'N' || x[0] == 'n') {
						rl.close()
						console.log('So, you just accidentally run me in a wrong folder. Exitting...')
						process.exit(1)
					} else {
						askUser()
					}
				})
			})()
		}
	}
} catch(err) {
	logger.logger.fatal({file: config_path, err: err}, 'cannot open config file @{file}: @{!err.message}')
	process.exit(1)
}

if (!have_question) afterConfigLoad()

function get_hostport() {
	// command line || config file || default
	var hostport = commander.listen || String(config.listen || '') || '4873'

	hostport = hostport.split(':')
	if (hostport.length < 2) {
		hostport = [undefined, hostport[0]]
	}
	if (hostport[0] == null) {
		hostport[0] = 'localhost'
	}
	return hostport
}

function afterConfigLoad() {
	if (!config.user_agent) config.user_agent = 'Sinopia/'+pkg.version
	if (!config.self_path) config.self_path = config_path

	logger.setup(config.logs)

	var hostport = get_hostport()
	server(config).listen(hostport[1], hostport[0])
	logger.logger.warn({addr: 'http://'+hostport[0]+':'+hostport[1]+'/'}, 'Server is listening on @{addr}')

	// undocumented stuff for tests
	if (typeof(process.send) === 'function') {
		process.send({sinopia_started: hostport})
	}
}

function write_config_banner(def, config) {
	var hostport = get_hostport()
	console.log('===========================================================')
	console.log(' Creating a new configuration file: "%s"', config_path)
	console.log(' ')
	console.log(' If you want to setup npm to work with this registry,')
	console.log(' run following commands:')
	console.log(' ')
	console.log(' $ npm set registry http://%s:%s/', hostport[0], hostport[1])
	console.log(' $ npm set always-auth true')
	console.log(' $ npm adduser')
	console.log('   Username: %s', def.user)
	console.log('   Password: %s', def.pass)
	console.log('===========================================================')
}

process.on('uncaughtException', function(err) {
	logger.logger.fatal({err: err}, 'uncaught exception, please report this\n@{err.stack}')
	process.exit(255)
})

