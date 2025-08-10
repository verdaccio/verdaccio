import isEmpty from 'lodash/isEmpty';

import { Route } from '../../utils';

export interface SecurityUrlParams {
  next: string;
  user: string;
}

export interface LocationLike {
  search: string;
}

export function getSecurityUrlParams(location: LocationLike): SecurityUrlParams {
  const queryParams = new URLSearchParams(location.search);

  // Get next parameter to match v1 URLs
  let next = queryParams.get('next') || '';
  if (next.length > 0 && (!next.startsWith(Route.LOGIN_API) || !next.match(/\/[-0-9a-f]{36}$/))) {
    next = '';
  }

  // Ignore user parameter if it does not match expected format (prevent XSS attacks)
  let user = queryParams.get('user') || '';
  if (user.length > 0 && !user.match(/^[a-zA-Z0-9-_]{1,255}$/)) {
    user = '';
  }

  return { next, user };
}

export interface TranslationFunction {
  (key: string, options?: Record<string, unknown>): string;
}

export interface DispatchAction {
  (payload: { type: string; description: string }): void;
}

export const validateCredentials = (
  username: string,
  password: string,
  t: TranslationFunction,
  dispatchAction: DispatchAction
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
