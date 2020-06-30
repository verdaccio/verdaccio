import supertest from 'supertest';

import {initializeServer } from './_helper';
import { HTTP_STATUS } from '@verdaccio/commons-api';
import {HEADER_TYPE, HEADERS} from '@verdaccio/dev-commons';

describe('ping', () => {
	test('should return the reply the ping', async () => {
		return supertest(await initializeServer('ping.yaml'))
			.get('/-/ping')
			.set('Accept', HEADERS.JSON)
			.expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
			.expect(HTTP_STATUS.OK)
			.then(response => expect(response.body).toEqual({}));
	});
});
