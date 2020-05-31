import supertest from 'supertest';

import {initializeServer } from './_helper';
import { HTTP_STATUS } from '@verdaccio/commons-api';
import { HEADERS} from '@verdaccio/dev-commons';
import {$RequestExtend, $ResponseExtend} from "@verdaccio/dev-types";

jest.mock('@verdaccio/logger', () => ({
	setup: jest.fn(),
	logger: {
		child: jest.fn(() => ({
			trace: jest.fn()
		})),
		debug: jest.fn(),
		trace:  jest.fn(),
		warn:  jest.fn(),
		error:  jest.fn(),
		fatal: jest.fn(),
	}
}));

const mockApiJWTmiddleware = jest.fn(() =>
	(req: $RequestExtend, res: $ResponseExtend, _next): void => {
			req.remote_user = { name: 'foo', groups: [], real_groups: []}
			_next();
		}
);

jest.mock('@verdaccio/auth', () => ({
	Auth: class {
		apiJWTmiddleware() {
			return mockApiJWTmiddleware();
		}
		allow_access (_d, f_, cb) {
			cb(null, true)
		}
	}
}));

describe('whoami', () => {
	test('should return the logged username', () => {
		return supertest(initializeServer('whoami.yaml'))
			.get('/-/whoami')
			.set('Accept', HEADERS.JSON)
			.expect('Content-Type', HEADERS.JSON_CHARSET)
			.expect(HTTP_STATUS.OK)
			.then(response => {
				expect(response.body.username).toEqual('foo');
			});
	});
});
