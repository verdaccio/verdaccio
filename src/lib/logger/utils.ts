import dayjs from 'dayjs';

export const FORMAT_DATE = 'YYYY-MM-DD HH:mm:ss';

export function formatLoggingDate(time: string): string {
    return dayjs(time).format(FORMAT_DATE);
}
