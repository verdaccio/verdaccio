import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import size from 'lodash/size';
import {Base64} from 'js-base64';
import API from './api';
import {HEADERS} from '../../lib/constants';

export function isTokenExpire(token) {
    if (!isString(token)) {
        return true;
    }

    let payload = token.split('.')[1];

    if (!payload) {
        return true;
    }

    try {
        payload = JSON.parse(Base64.decode(payload));
    } catch (err) {
        console.error('Invalid token:', err, token); // eslint-disable-line
        return false;
    }

    if (!payload.exp || !isNumber(payload.exp)) {
        return true;
    }
    // Report as expire before (real expire time - 30s)
    const jsTimestamp = payload.exp * 1000 - 30000;
    const expired = Date.now() >= jsTimestamp;

    return expired;
}


export async function makeLogin(username, password) {
    const payload = {};

    if (isString(username) === false && isString(password) === false) {
        payload.error = {
            title: 'Unable to login',
            type: 'error',
            description: 'Something went wrong.'
        };
        return payload;
    }

    if (size(username) < 1 || size(password) < 1) {
        payload.error = {
            title: 'Unable to login',
            type: 'error',
            description: 'Username or password can\'t be empty!'
        };
        return payload;
    }

    try {
        const credentials = {username, password};
        const resp = await API.request(`login`, 'POST', {
            body: JSON.stringify(credentials),
            headers: {
                Accept: HEADERS.JSON,
                'Content-Type': HEADERS.JSON
            }
        });
        payload.username = resp.username;
        payload.token = resp.token;
        return payload;
    } catch (e) {
        payload.error = {
            title: 'Unable to login',
            type: 'error',
            description: e.error
        };
        return payload;
    }
}
