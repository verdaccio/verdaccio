import _ from 'lodash';

export function isObject(obj: any): boolean {
    return _.isObject(obj) && _.isNull(obj) === false && _.isArray(obj) === false;
}

/**
 * Apply whitespaces based on the length
 * @param {*} str the log message
 * @return {String}
 */
export function pad(str, max): string {
    if (str.length < max) {
        return str + ' '.repeat(max - str.length);
    }
    return str;
}
