import _ from 'lodash';
import padRight from 'pad-right';
import dayjs from 'dayjs';

export const FORMAT_DATE = 'YYYY-MM-DD HH:mm:ss';

export function isObject(obj: unknown): boolean {
  return _.isObject(obj) && _.isNull(obj) === false && _.isArray(obj) === false;
}

export function pad(str: string, max: number): string {
  return padRight(str, max, ' ');
}

export function formatLoggingDate(time: number, message): string {
  const timeFormatted = dayjs(time).format(FORMAT_DATE);

  return `[${timeFormatted}]${message}`;
}
