import isEmpty from 'lodash/isEmpty';
import API from './api';
import {HEADERS} from '../../lib/constants';

export async function makeLogin(username, password) {
    // checks isEmpty
    if (isEmpty(username) || isEmpty(password)) {
        const error = {
            title: 'Unable to login',
            type: 'error',
            description: 'Username or password can\'t be empty!'
        };
        return {error};
    }

    try {
        const response = await API.request('login', 'POST', {
            body: JSON.stringify({username, password}),
            headers: {
                Accept: HEADERS.JSON,
                'Content-Type': HEADERS.JSON
            }
        });
        const result = {
            username: response.username,
            token: response.token
        };
        return result;
    } catch (e) {
        const error = {
            title: 'Unable to login',
            type: 'error',
            description: e.error
        };
        return {error};
    }
}
