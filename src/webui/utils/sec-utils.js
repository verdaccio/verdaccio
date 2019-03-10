/**
 * @prettier
 * @flow
 */
// $FlowFixMe
import parseXSS from 'xss';

export function preventXSS(text: string) {
  const encodedText = parseXSS(text);

  return encodedText;
}
