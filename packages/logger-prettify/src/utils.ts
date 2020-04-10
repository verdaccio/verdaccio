import _ from 'lodash';
import padRight from 'pad-right';

export function isObject(obj: unknown): boolean {
    return _.isObject(obj) && _.isNull(obj) === false && _.isArray(obj) === false;
}

/**
 * Apply whitespaces based on the length
 * @param {*} str the log message
 * @return {String}
 */
export function pad(str: string, max: number): string {
    return padRight(str, max, ' ');
}
