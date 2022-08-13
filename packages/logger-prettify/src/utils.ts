import dayjs from 'dayjs';
import _ from 'lodash';

export const FORMAT_DATE = 'YYYY-MM-DD HH:mm:ss';
export const CUSTOM_PAD_LENGTH = 1;

export function isObject(obj: unknown): boolean {
  return _.isObject(obj) && _.isNull(obj) === false && _.isArray(obj) === false;
}

export function padLeft(message: string) {
  return message.padStart(message.length + CUSTOM_PAD_LENGTH, ' ');
}

export function padRight(message: string, max = message.length + CUSTOM_PAD_LENGTH) {
  return message.padEnd(max, ' ');
}

export function formatLoggingDate(time: number, message: string): string {
  const timeFormatted = dayjs(time).format(FORMAT_DATE);

  return `[${timeFormatted}]${message}`;
}
