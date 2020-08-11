import {Config, RemoteUser, Security} from "@verdaccio/types";
import {AuthMiddlewarePayload, AuthTokenHeader, BasicPayload, IAuthWebUI} from "@verdaccio/dev-types";
import _ from "lodash";
import {HTTP_STATUS, TOKEN_BASIC, TOKEN_BEARER} from "@verdaccio/dev-commons";
import {
	aesDecrypt,
	buildUserBuffer,
	convertPayloadToBase64,
	createAnonymousRemoteUser,
	defaultSecurity,
	ErrorCode,
	verifyPayload
} from "@verdaccio/utils";

export function parseAuthTokenHeader(authorizationHeader: string): AuthTokenHeader {
	const parts = authorizationHeader.split(' ');
	const [scheme, token] = parts;

	return { scheme, token };
}

export function parseAESCredentials(authorizationHeader: string, secret: string) {
	const { scheme, token } = parseAuthTokenHeader(authorizationHeader);

	// basic is deprecated and should not be enforced
	if (scheme.toUpperCase() === TOKEN_BASIC.toUpperCase()) {
		const credentials = convertPayloadToBase64(token).toString();

		return credentials;
	} else if (scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
		const tokenAsBuffer = convertPayloadToBase64(token);
		const credentials = aesDecrypt(tokenAsBuffer, secret).toString('utf8');

		return credentials;
	}
}

export function getMiddlewareCredentials(security: Security, secret: string, authorizationHeader: string): AuthMiddlewarePayload {
	if (isAESLegacy(security)) {
		const credentials = parseAESCredentials(authorizationHeader, secret);
		if (!credentials) {
			return;
		}

		const parsedCredentials = parseBasicPayload(credentials);
		if (!parsedCredentials) {
			return;
		}

		return parsedCredentials;
	}
	const { scheme, token } = parseAuthTokenHeader(authorizationHeader);

	if (_.isString(token) && scheme.toUpperCase() === TOKEN_BEARER.toUpperCase()) {
		return verifyJWTPayload(token, secret);
	}
}


export function isAESLegacy(security: Security): boolean {
	const { legacy, jwt } = security.api;

	return _.isNil(legacy) === false && _.isNil(jwt) && legacy === true;
}

export async function getApiToken(auth: IAuthWebUI, config: Config, remoteUser: RemoteUser, aesPassword: string): Promise<string> {
	const security: Security = getSecurity(config);

	if (isAESLegacy(security)) {
		// fallback all goes to AES encryption
		return await new Promise((resolve): void => {
			resolve(auth.aesEncrypt(buildUserBuffer(remoteUser.name as string, aesPassword)).toString('base64'));
		});
	}
	// i am wiling to use here _.isNil but flow does not like it yet.
	const { jwt } = security.api;

	if (jwt?.sign) {
		return await auth.jwtEncrypt(remoteUser, jwt.sign);
	}
	return await new Promise((resolve): void => {
		resolve(auth.aesEncrypt(buildUserBuffer(remoteUser.name as string, aesPassword)).toString('base64'));
	});
}

export function getSecurity(config: Config): Security {
	if (_.isNil(config.security) === false) {
		return _.merge(defaultSecurity, config.security);
	}

	return defaultSecurity;
}

export const expireReasons: string[] = ['JsonWebTokenError', 'TokenExpiredError'];

export function verifyJWTPayload(token: string, secret: string): RemoteUser {
	try {
		const payload: RemoteUser = verifyPayload(token, secret);

		return payload;
	} catch (error) {
		// #168 this check should be removed as soon AES encrypt is removed.
		if (expireReasons.includes(error.name)) {
			// it might be possible the jwt configuration is enabled and
			// old tokens fails still remains in usage, thus
			// we return an anonymous user to force log in.
			return createAnonymousRemoteUser();
		}
		throw ErrorCode.getCode(HTTP_STATUS.UNAUTHORIZED, error.message);
	}
}

export function isAuthHeaderValid(authorization: string): boolean {
	return authorization.split(' ').length === 2;
}

export function parseBasicPayload(credentials: string): BasicPayload {
	const index = credentials.indexOf(':');
	if (index < 0) {
		return;
	}

	const user: string = credentials.slice(0, index);
	const password: string = credentials.slice(index + 1);

	return { user, password };
}
