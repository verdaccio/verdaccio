import _ from 'lodash';

export function getUserAgent(
  customUserAgent?: boolean | string,
  version?: string,
  name?: string
): string {
  if (customUserAgent === true) {
    return `${name}/${version}`;
  } else if (_.isString(customUserAgent) && _.isEmpty(customUserAgent) === false) {
    return customUserAgent;
  } else if (customUserAgent === false) {
    return 'hidden';
  }

  return `${name}/${version}`;
}
