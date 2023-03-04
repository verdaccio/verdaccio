/**
 * Quality values, or q-values and q-factors, are used to describe the order
 * of priority of values in a comma-separated list.
 * It is a special syntax allowed in some HTTP headers and in HTML.
 * https://developer.mozilla.org/en-US/docs/Glossary/Quality_values
 * @param headerValue
 */
export function getByQualityPriorityValue(headerValue: string | undefined | null): string {
  if (typeof headerValue !== 'string') {
    return '';
  }

  const split = headerValue.split(',');

  if (split.length <= 1) {
    const qList = split[0].split(';');
    return qList[0];
  }

  let [header] = split
    .reduce((acc, item: string) => {
      const qList = item.split(';');
      if (qList.length > 1) {
        const [accept, q] = qList;
        const [, query] = q.split('=');
        acc.push([accept.trim(), query ? query : 0]);
      } else {
        acc.push([qList[0], 0]);
      }
      return acc;
    }, [] as any)
    .sort(function (a: number[], b: number[]) {
      return b[1] - a[1];
    });
  return header[0];
}
