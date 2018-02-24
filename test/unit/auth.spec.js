// @flow

import Auth from '../../src/lib/auth';
jest.mock('../../src/lib/auth');
// $FlowFixMe
import configExample from './partials/config';
import AppConfig from '../../src/lib/config';
import {setup} from '../../src/lib/logger';


import type {IAuth, Config} from '@verdaccio/types';

setup(configExample.logs);

describe('AuthTest', () => {

	test('should be defined', () => {
		const config: Config = new AppConfig(configExample);
		const auth: IAuth = new Auth(config);

		expect(auth).toBeDefined();
		expect(Auth).toHaveBeenCalledTimes(1);
	});

});