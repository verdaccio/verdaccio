/**
 * Normalizes a request param that may be a string or array of strings.
 * Returns a string (first element if array), or empty string if undefined/null.
 *
 * @param param - The req.param value which may be string, string[], or undefined.
 * @returns The normalized string value.
 */
export function paramToString(param: string | string[] | undefined): string {
  return Array.isArray(param) ? (param[0] ?? '') : (param ?? '');
}
