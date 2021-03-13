// @flow
import _ from 'lodash';
import { stringToMD5 } from '../lib/crypto-utils';

// this is a generic avatar
// https://www.iconfinder.com/icons/403017/anonym_avatar_default_head_person_unknown_user_icon
// license: free commercial usage
export const GENERIC_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg height="100" viewBox="-27 24 100 100" width="100" xmlns="http://www.w3.org/' +
      '2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle cx="23" cy="7' +
      '4" id="a" r="50"/></defs><use fill="#F5EEE5" overflow="visible" xlink:href="#a"/' +
      '><clipPath id="b"><use overflow="visible" xlink:href="#a"/></clipPath><g clip-pa' +
      'th="url(#b)"><defs><path d="M36 95.9c0 4 4.7 5.2 7.1 5.8 7.6 2 22.8 5.9 22.8 5.9' +
      ' 3.2 1.1 5.7 3.5 7.1 6.6v9.8H-27v-9.8c1.3-3.1 3.9-5.5 7.1-6.6 0 0 15.2-3.9 22.8-' +
      '5.9 2.4-.6 7.1-1.8 7.1-5.8V85h26v10.9z" id="c"/></defs><use fill="#E6C19C" overf' +
      'low="visible" xlink:href="#c"/><clipPath id="d"><use overflow="visible" xlink:hr' +
      'ef="#c"/></clipPath><path clip-path="url(#d)" d="M23.2 35h.2c3.3 0 8.2.2 11.4 2 ' +
      '3.3 1.9 7.3 5.6 8.5 12.1 2.4 13.7-2.1 35.4-6.3 42.4-4 6.7-9.8 9.2-13.5 9.4H23h-.' +
      '1c-3.7-.2-9.5-2.7-13.5-9.4-4.2-7-8.7-28.7-6.3-42.4 1.2-6.5 5.2-10.2 8.5-12.1 3.2' +
      '-1.8 8.1-2 11.4-2h.2z" fill="#D4B08C"/></g><path d="M22.6 40c19.1 0 20.7 13.8 20' +
      '.8 15.1 1.1 11.9-3 28.1-6.8 33.7-4 5.9-9.8 8.1-13.5 8.3h-.5c-3.8-.3-9.6-2.5-13.6' +
      '-8.4-3.8-5.6-7.9-21.8-6.8-33.8C2.3 53.7 3.5 40 22.6 40z" fill="#F2CEA5"/></svg>'
  );

/**
 * Generate gravatar url from email address
 */
export function generateGravatarUrl(email: string | void = '', online: boolean = true): string {
  if (online && _.isString(email) && _.size(email) > 0) {
    email = email.trim().toLocaleLowerCase();
    const emailMD5 = stringToMD5(email);
    return `https://www.gravatar.com/avatar/${emailMD5}`;
  }
  return GENERIC_AVATAR;
}
