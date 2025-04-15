import isEmpty from 'lodash/isEmpty';

import { Route } from '../../utils';

export interface SecurityUrlParams {
  next: string;
  user: string;
}

export function getSecurityUrlParams(location: any): SecurityUrlParams {
  const queryParams = new URLSearchParams(location.search);

  // Get next parameter to match v1 URLs
  let next = queryParams.get('next') || '';
  if (next.length > 0) {
    const nextRegex = new RegExp(`^${Route.LOGIN_API.replace(/\//g, '\\/')}/[-0-9a-f]{36}$`);
    if (!nextRegex.test(next)) next = '';
  }

  // Ignore user parameter if it does not match expected format (prevent XSS attacks)
  let user = queryParams.get('user') || '';
  if (user.length > 0) {
    const userRegex = /^[a-zA-Z0-9-_]*$/;
    if (!userRegex.test(user)) user = '';
  }

  return { next, user };
}

export const validateCredentials = (
  username: string,
  password: string,
  t: (key: string, options?: any) => string,
  dispatchAction: (payload: any) => void
): boolean => {
  if (!username || !password || isEmpty(username) || isEmpty(password)) {
    dispatchAction({
      type: 'error',
      description: t('security.error.username-or-password-cant-be-empty'),
    });
    return false;
  }

  if (username.length < 2) {
    dispatchAction({
      type: 'error',
      description: t('security.error.username-min-length', { length: 2 }),
    });
    return false;
  }

  // Validate username contains only url-safe characters
  if (!username.match(/^[-a-zA-Z0-9_.!~*'()@]+$/)) {
    dispatchAction({
      type: 'error',
      description: t('security.error.username-must-be-url-safe'),
    });
    return false;
  }

  // Note: password rules should be checked in auth plugin
  return true;
};
