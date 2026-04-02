import buildDebug from 'debug';
import { isNil } from 'lodash-es';

const debug = buildDebug('verdaccio:web:middlwares');

export function validatePrimaryColor(primaryColor) {
  const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(primaryColor);
  if (!isHex) {
    debug('invalid primary color %o', primaryColor);
    return;
  }

  return primaryColor;
}

export function hasLogin(config: any) {
  return isNil(config?.web?.login) || config?.web?.login === true;
}
