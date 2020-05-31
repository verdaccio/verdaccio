import path from "path";
import express from 'express';

import {parseConfigFile}  from '@verdaccio/utils';
import { Config } from '@verdaccio/config';
import { Storage } from '@verdaccio/store';
import { final, handleError, errorReportingMiddleware } from '@verdaccio/middleware';
import { Auth } from '@verdaccio/auth';
import apiEndpoints from '../../src';
import {IAuth} from "@verdaccio/dev-types";

const getConf = (conf) => {
	const configPath = path.join(__dirname, 'config', conf);

	return parseConfigFile(configPath);
};

export function initializeServer(configName): any {
	const app = express();
	const config = new Config(getConf(configName));
	const storage = new Storage(config);
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
