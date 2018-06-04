export const TIMEFORMAT = 'YYYY/MM/DD, HH:mm:ss';
import format from 'date-fns/format';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';


export function formatDate(lastUpdate) {
  return format(new Date(lastUpdate), TIMEFORMAT);
}

export function formatDateDistance(lastUpdate) {
  return distanceInWordsToNow(new Date(lastUpdate));
}
