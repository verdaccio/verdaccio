import dayjs from 'dayjs';

export const FORMAT_DATE = 'YYYY-MM-DD HH:mm:ss';
export const CUSTOM_PAD_LENGTH = 1;

export function formatLoggingDate(time: string): string {
  return dayjs(time).format(FORMAT_DATE);
}

export function padLeft(message: string) {
  return message.padStart(message.length + CUSTOM_PAD_LENGTH, ' ');
}

export function padRight(message: string, max = message.length + CUSTOM_PAD_LENGTH) {
  return message.padEnd(max, ' ');
}
