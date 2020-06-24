import supertest from 'supertest';

import {initializeServer, publishTaggedVersion, publishVersion} from './_helper';
import { HTTP_STATUS } from '@verdaccio/commons-api';
import {HEADER_TYPE, HEADERS} from '@verdaccio/dev-commons';
import {$RequestExtend, $ResponseExtend} from "@verdaccio/dev-types";

const mockApiJWTmiddleware = jest.fn(() =>
	(req: $RequestExtend, res: $ResponseExtend, _next): void => {
			req.remote_user = { name: 'foo', groups: [], real_groups: []}
			_next();
		}
);

jest.setTimeout(50000000);

jest.mock('@verdaccio/auth', () => ({
	Auth: class {
		apiJWTmiddleware() {
			return mockApiJWTmiddleware();
		}
		allow_access (_d, f_, cb) {
			cb(null, true)
		}
		allow_publish (_d, f_, cb) {
			cb(null, true)
		}
	}
}));

describe('package', () => {
	let app;
	beforeAll(async () => {
		app = await initializeServer('package.yaml');
		// await publishVersion(app, 'package.yaml', 'foo', '1.0.0');
	});

	test.skip('should return a package', async (done) => {
		return supertest(app)
			.get('/foo')
			.set('Accept', HEADERS.JSON)
			.expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
			.expect(HTTP_STATUS.OK)
			.then(response => {
				expect(response.body.name).toEqual('foo');
				done();
			});
	});

	test.skip('should return a package by version', async (done) => {
		return supertest(app)
			.get('/foo/1.0.0')
			.set('Accept', HEADERS.JSON)
			.expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
			.expect(HTTP_STATUS.OK)
			.then(response => {
				expect(response.body.name).toEqual('foo');
				done();
			});
	});

	test.skip('should return a package by dist-tag', async (done) => {
		await publishVersion(app, 'package.yaml', 'foo-tagged', '1.0.0');
		await publishTaggedVersion(app, 'package.yaml', 'foo-tagged', '1.0.1', 'test');
		return supertest(app)
			.get('/foo-tagged/1.0.1')
			.set('Accept', HEADERS.JSON)
			.expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
			.expect(HTTP_STATUS.CREATED)
			.then(response => {
				expect(response.body.name).toEqual('foo');
				done();
			});
	});

	test('should return 404', async () => {
		return supertest(app)
			.get('/404-not-found')
			.set('Accept', HEADERS.JSON)
			.expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
			.expect(HTTP_STATUS.NOT_FOUND);
	});
});
