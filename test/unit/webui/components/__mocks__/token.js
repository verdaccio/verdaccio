/**
 * Token Utility
 */

import { Base64 } from 'js-base64';
import addHours from 'date-fns/add_hours';

export function generateTokenWithTimeRange (limit = 0) {
    const payload = {
        username: 'verdaccio',
        exp: Number.parseInt(addHours(new Date(), limit).getTime() / 1000, 10)
    };
    return `xxxxxx.${Base64.encode(JSON.stringify(payload))}.xxxxxx`;
}

export function generateTokenWithExpirationAsString () {
    const payload = { username: 'verdaccio', exp: 'I am not a number' };
    return `xxxxxx.${Base64.encode(payload)}.xxxxxx`;
}

export function generateTokenWithOutExpiration (){
    const payload = {
        username: 'verdaccio'
    };
    return `xxxxxx.${Base64.encode(JSON.stringify(payload))}.xxxxxx`;
}