import { isEmpty } from 'lodash-es';

export function getUserAgent(
  customUserAgent?: boolean | string,
  version?: string,
  name?: string
): string {
  if (customUserAgent === true) {
    return `${name}/${version}`;
  } else if (typeof customUserAgent === 'string' && isEmpty(customUserAgent) === false) {
    return customUserAgent;
  } else if (customUserAgent === false) {
    return 'hidden';
  }

  return `${name}/${version}`;
}
