import dayjs from 'dayjs';

export const FORMAT_DATE = 'YYYY-MM-DD HH:mm:ss';
export const CUSTOM_PAD_LENGTH = 1;

export function isObject(obj: unknown): boolean {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export function padRight(message: string, max = message.length + CUSTOM_PAD_LENGTH) {
  return message.padEnd(max, ' ');
}

export function formatLoggingDate(time: number, message: string): string {
  const timeFormatted = dayjs(time).format(FORMAT_DATE);

  return `[${timeFormatted}] ${message}`;
}
