/**
 * Date time in LocaleString
 * @param {string} input
 * @returns {string}
 */
export default function datetime(input) {
  const date = new Date(input);
  return date.toLocaleString('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}
