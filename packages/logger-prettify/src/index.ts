// const defaultOptions = {
// 	colorize: chalk.supportsColor,
// 	crlf: false,
// 	errorLikeObjectKeys: ERROR_LIKE_KEYS,
// 	errorProps: '',
// 	levelFirst: false,
// 	messageKey: MESSAGE_KEY,
// 	messageFormat: false,
// 	timestampKey: TIMESTAMP_KEY,
// 	translateTime: false,
// 	useMetadata: false,
// 	outputStream: process.stdout,
// 	customPrettifiers: {}
// }

/**
 * examples
 *
 *
 *

	 {
			level: 40,
			time: 1585410824129,
			v: 1,
			pid: 27029,
			hostname: 'macbook-touch',
			file: '/Users/jpicado/.config/@verdaccio/config/config.yaml',
			msg: 'config file  - @{file}'
		}

    {
			level: 40,
			time: 1585410824322,
			v: 1,
			pid: 27029,
			hostname: 'macbook-touch',
			addr: 'http://localhost:4873/',
			version: 'verdaccio/5.0.0',
			msg: 'http address - @{addr} - @{version}'
		}

		 {
			level: 40,
			time: 1585410824322,
			v: 1,
			pid: 27029,
			hostname: 'macbook-touch',
			addr: 'http://localhost:4873/',
			version: 'verdaccio/5.0.0',
			msg: 'http address - @{addr} - @{version}'
		}

	 {
		level: 30,
		time: 1585411247622,
		v: 1,
		pid: 27029,
		hostname: 'macbook-touch',
		sub: 'in',
		req: {
			id: undefined,
			method: 'GET',
			url: '/verdaccio',
			headers: {
				connection: 'keep-alive',
				'user-agent': 'npm/6.13.2 node/v13.1.0 darwin x64',
				'npm-in-ci': 'false',
				'npm-scope': '',
				'npm-session': 'afebb4748178bd4b',
				referer: 'view verdaccio',
				'pacote-req-type': 'packument',
				'pacote-pkg-id': 'registry:verdaccio',
				accept: 'application/json',
				authorization: '<Classified>',
				'if-none-match': '"fd6440ba2ad24681077664d8f969e5c3"',
				'accept-encoding': 'gzip,deflate',
				host: 'localhost:4873'
			},
			remoteAddress: '127.0.0.1',
			remotePort: 57968,
			[Symbol(pino-raw-req-ref)]: IncomingMessage {
				_readableState: [ReadableState],
				readable: true,
				_events: [Object: null prototype],
				_eventsCount: 1,
				_maxListeners: undefined,
				socket: [Socket],
				httpVersionMajor: 1,
				httpVersionMinor: 1,
				httpVersion: '1.1',
				complete: false,
				headers: [Object],
				rawHeaders: [Array],
				trailers: {},
				rawTrailers: [],
				aborted: false,
				upgrade: false,
				url: '/verdaccio',
				method: 'GET',
				statusCode: null,
				statusMessage: null,
				client: [Socket],
				_consuming: false,
				_dumped: false,
				next: [Function: next],
				baseUrl: '',
				originalUrl: '/verdaccio',
				_parsedUrl: [Url],
				params: {},
				query: {},
				res: [ServerResponse],
				log: [Pino]
			}
		},
		ip: '127.0.0.1',
		msg: "@{ip} requested '@{req.method} @{req.url}'"
	}

	 {
		level: 35,
		time: 1585411247920,
		v: 1,
		pid: 27029,
		hostname: 'macbook-touch',
		sub: 'out',
		request: { method: 'GET', url: 'https://registry.npmjs.org/verdaccio' },
		status: 304,
		msg: "@{!status}, req: '@{request.method} @{request.url}' (streaming)"
	}

 {
		level: 35,
		time: 1585411248203,
		v: 1,
		pid: 27029,
		hostname: 'macbook-touch',
		sub: 'in',
		request: { method: 'GET', url: '/verdaccio' },
		user: null,
		remoteIP: '127.0.0.1',
		status: 200,
		error: undefined,
		bytes: { in: 0, out: 150186 },
		msg: "@{status}, user: @{user}(@{remoteIP}), req: '@{request.method} @{request.url}', bytes: @{bytes.in}/@{bytes.out}"
	}

 {
  level: 35,
  time: 1585416029123,
  v: 1,
  pid: 30032,
  hostname: 'macbook-touch',
  sub: 'out',
  err: {
    type: 'Error',
    message: 'getaddrinfo ENOTFOUND registry.ndsadsapmjs.org',
    stack: 'Error: getaddrinfo ENOTFOUND registry.ndsadsapmjs.org\n' +
      '    at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:60:26)',
    errno: -3008,
    code: 'ENOTFOUND',
    syscall: 'getaddrinfo',
    hostname: 'registry.ndsadsapmjs.org',
    [Symbol(pino-raw-err-ref)]: Error: getaddrinfo ENOTFOUND registry.ndsadsapmjs.org
        at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:60:26) {
      errno: -3008,
      code: 'ENOTFOUND',
      syscall: 'getaddrinfo',
      hostname: 'registry.ndsadsapmjs.org'
    }
  },
  request: { method: 'GET', url: 'https://registry.ndsadsapmjs.org/aaa' },
  status: 'ERR',
  error: 'getaddrinfo ENOTFOUND registry.ndsadsapmjs.org',
  bytes: { in: 0, out: 0 },
  msg: "@{!status}, req: '@{request.method} @{request.url}', error: @{!error}"
}
 */


import {printMessage} from "./formatter";

module.exports = function prettyFactory (options) {
	const nl = '\n'
	return inputData => {
		return printMessage(inputData.level, inputData.msg, inputData, true) + nl;
	};
}
