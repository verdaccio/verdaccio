// @flow
import {stringToMD5} from '../lib/crypto-utils';
import _ from 'lodash';

export const GRAVATAR_DEFAULT =
  'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm';
/**
 * Generate gravatar url from email address
 */
export function generateGravatarUrl(email: string = ''): string {
  if (_.isString(email) && _.size(email) > 0) {
    email = email.trim().toLocaleLowerCase();
    const emailMD5 = stringToMD5(email);
    return `https://www.gravatar.com/avatar/${emailMD5}`;
  }
  return GRAVATAR_DEFAULT;
}
