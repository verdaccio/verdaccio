import path from "path";
import express, {Application} from 'express';
import supertest from 'supertest';

import {parseConfigFile}  from '@verdaccio/utils';
import { Config } from '@verdaccio/config';
import { Storage } from '@verdaccio/store';
import { final, handleError, errorReportingMiddleware } from '@verdaccio/middleware';
import { Auth } from '@verdaccio/auth';
import apiEndpoints from '../../src';
import {IAuth} from "@verdaccio/dev-types";
import {HEADER_TYPE, HTTP_STATUS, generatePackageMetadata} from "@verdaccio/dev-commons";
import {HEADERS} from "@verdaccio/commons-api";

const getConf = (conf) => {
	const configPath = path.join(__dirname, 'config', conf);

	return parseConfigFile(configPath);
};

export async function initializeServer(configName): Promise<Application> {
	const app = express();
	const config = new Config(getConf(configName));
	const storage = new Storage(config);
	await storage.init(config, []);
	const auth: IAuth = new Auth(config);
	// @ts-ignore
	app.use(errorReportingMiddleware);
	// @ts-ignore
	app.use(apiEndpoints(config, auth, storage));
	// @ts-ignore
	app.use(handleError);
	// @ts-ignore
	app.use(final);

	app.use(function(request, response) {
		response.status(590);
		response.json({error: 'cannot handle this'});
	});

	return app;
}

export async function publishVersion(app, configFile, pkgName, version) {
		const pkgMetadata = generatePackageMetadata(pkgName, version);

		return supertest(app)
			.put(`/${pkgName}`)
			.set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
		.send(JSON.stringify(pkgMetadata))
		.expect(HTTP_STATUS.CREATED)
		.set('accept', 'gzip')
		.set('accept-encoding', HEADERS.JSON)
		.set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON);
}
