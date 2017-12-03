// @flow
import {stringToMD5} from './string';

/**
 * Generate gravatar url from email address
 */
export function generateGravatarUrl(email?: string): string {
  if (typeof email === 'string') {
    email = email.trim().toLocaleLowerCase();
    let emailMD5 = stringToMD5(email);
    return `https://www.gravatar.com/avatar/${emailMD5}`;
  } else {
    return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm';
  }
}
