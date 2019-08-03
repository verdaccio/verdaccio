import _ from 'lodash';
import { HTTP_STATUS, SUPPORT_ERRORS } from '../../../../lib/constants';
import { ErrorCode } from '../../../../lib/utils';
import { getApiToken } from '../../../../lib/auth-utils';
import { stringToMD5 } from '../../../../lib/crypto-utils';
import { logger } from '../../../../lib/logger';

import { Response, Router } from 'express';
import {$NextFunctionVer, $RequestExtend, IAuth, IStorageHandler} from '../../../../../types';
import { Config, RemoteUser, Token } from '@verdaccio/types';

export type NormalizeToken = Token & {
	created: string;
};

function normalizeToken(token: Token): NormalizeToken {
	return {
		...token,
		created: new Date(token.created).toISOString(),
	};
};

// https://github.com/npm/npm-profile/blob/latest/lib/index.js
export default function(route: Router, auth: IAuth, storage: IStorageHandler, config: Config) {
	route.get('/-/npm/v1/tokens', async function(req: $RequestExtend, res: Response, next: $NextFunctionVer) {
		const { name } = req.remote_user;

		if (_.isNil(name) === false) {
			const tokens = await storage.readTokens({user: name});

			res.status(HTTP_STATUS.OK);
			next({
				objects: tokens.map(normalizeToken),
				urls: {
					next: '', // TODO: pagination?
				},
			});
		} else {
			return next(ErrorCode.getUnauthorized());
		}
	});

	route.post('/-/npm/v1/tokens', function(req: $RequestExtend, res: Response, next: $NextFunctionVer) {
		const { password, readonly, cidr_whitelist } = req.body;
		const { name } = req.remote_user;

		if (!_.isBoolean(readonly) || !_.isArray(cidr_whitelist)) {
			next(ErrorCode.getCode(HTTP_STATUS.BAD_DATA, SUPPORT_ERRORS.PARAMETERS_NOT_VALID));
			return;
		}

		auth.authenticate(name, password, async (err, user: RemoteUser) => {
			if (err) {
				const errorCode = err.message ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.INTERNAL_ERROR;
				next(ErrorCode.getCode(errorCode, err.message));
			} else {
				req.remote_user = user;

				if (!_.isFunction(storage.saveToken)) {
					next(ErrorCode.getCode(HTTP_STATUS.NOT_IMPLEMENTED, SUPPORT_ERRORS.STORAGE_NOT_IMPLEMENT));
					return;
				}

				try {
					const token = await getApiToken(auth, config, user, password);
					const key = stringToMD5(token);
					const maskedToken = token.slice(0, 5);

					const saveToken: Token = {
						user: name,
						token: maskedToken,
						key,
						cidr: cidr_whitelist,
						readonly,
						created: new Date().getTime(),
					};

					await storage.saveToken(saveToken);
					return next({
						token,
						key: saveToken.key,
						cidr_whitelist,
						readonly,
						created: saveToken.created,
					});
				} catch (error) {
					logger.logger.error({ error }, 'token creation has failed: @{error}');
					next(ErrorCode.getCode(HTTP_STATUS.INTERNAL_ERROR, error.message));
				}
			}
		});
	});

	route.delete('/-/npm/v1/tokens/token/:tokenKey', function(req: $RequestExtend, res: Response, next: $NextFunctionVer) {
		// req.params
		next();
		// return next(ErrorCode.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE));
	});
}
