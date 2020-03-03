import dayjs from 'dayjs';
import _ from 'lodash';

export const FORMAT_DATE = 'YYYY-MM-DD HH:mm:ss';

export function formatLoggingDate(time: string): string {
    return dayjs(time).format(FORMAT_DATE);
}

/**
 * Check whether an element is an Object
 * @param {*} obj the element
 * @return {Boolean}
 */
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
