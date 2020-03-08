import {Security} from "@verdaccio/types";
import {AuthMiddlewarePayload} from "@verdaccio/dev-types";
import _ from "lodash";
import {TOKEN_BEARER} from "@verdaccio/dev-commons";
import {
	isAESLegacy,
	parseAESCredentials,
	parseAuthTokenHeader,
	parseBasicPayload,
	verifyJWTPayload
} from "@verdaccio/utils";

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
