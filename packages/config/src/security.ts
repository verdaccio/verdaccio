import { APITokenOptions, JWTOptions, Security } from '@verdaccio/types';

// TODO: get this from core package
export const TIME_EXPIRATION_1H = '1h';

const defaultWebTokenOptions: JWTOptions = {
  sign: {
    // The expiration token for the website is 7 days
    expiresIn: TIME_EXPIRATION_1H,
  },
  verify: {},
};

const defaultApiTokenConf: APITokenOptions = {
  legacy: true,
};

export const defaultSecurity: Security = {
  web: defaultWebTokenOptions,
  api: defaultApiTokenConf,
};
