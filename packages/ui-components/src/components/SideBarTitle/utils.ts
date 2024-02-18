import dayjs from 'dayjs';

export const TIMEFORMAT = 'L LTS';

export function formatDate(lastUpdate: string | number): string {
  return dayjs(new Date(lastUpdate)).format(TIMEFORMAT);
}

export function formatDateDistance(lastUpdate: Date | string | number): string {
  // @ts-ignore
  return dayjs(new Date(lastUpdate)).fromNow();
}
