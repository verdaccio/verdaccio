import supertest from 'supertest';

import {initializeServer } from './_helper';
import { HTTP_STATUS } from '@verdaccio/commons-api';
import { HEADERS} from '@verdaccio/dev-commons';

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

describe('ping', () => {
	test('should return the reply the ping', () => {
		return supertest(initializeServer('ping.yaml'))
			.get('/-/ping')
			.set('Accept', HEADERS.JSON)
			.expect('Content-Type', HEADERS.JSON_CHARSET)
			.expect(HTTP_STATUS.OK)
			.then(response => expect(response.body).toEqual({}));
	});
});
