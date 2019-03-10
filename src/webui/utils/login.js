import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import isEmpty from 'lodash/isEmpty';
import {Base64} from 'js-base64';
import API from './api';
import {HEADERS} from '../../lib/constants';

export function isTokenExpire(token) {
    if (!isString(token)) {
        return true;
    }

    let [,payload] = token.split('.');

    if (!payload) {
        return true;
    }

    try {
        payload = JSON.parse(Base64.decode(payload));
    } catch (error) {
        // eslint-disable-next-line
        console.error('Invalid token:', error, token);
        return true;
    }

    if (!payload.exp || !isNumber(payload.exp)) {
        return true;
    }
    // Report as expire before (real expire time - 30s)
    const jsTimestamp = (payload.exp * 1000) - 30000;
    const expired = Date.now() >= jsTimestamp;

    return expired;
}


export async function makeLogin(username, password) {
    // checks isEmpty
    if (isEmpty(username) || isEmpty(password)) {
        const error = {
            title: 'Unable to login',
            type: 'error',
            description: 'Username or password can\'t be empty!',
        };
        return {error};
    }

    try {
        const response = await API.request('login', 'POST', {
            body: JSON.stringify({username, password}),
            headers: {
                Accept: HEADERS.JSON,
                'Content-Type': HEADERS.JSON,
            },
        });
        const result = {
            username: response.username,
            token: response.token,
        };
        return result;
    } catch (e) {
        const error = {
            title: 'Unable to login',
            type: 'error',
            description: e.error,
        };
        return {error};
    }
}
