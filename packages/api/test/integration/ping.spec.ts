import supertest from 'supertest';

import {initializeServer } from './_helper';
import { HTTP_STATUS } from '@verdaccio/commons-api';
import { HEADERS} from '@verdaccio/dev-commons';

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
