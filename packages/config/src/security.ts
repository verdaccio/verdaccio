import { APITokenOptions, JWTOptions, Security } from '@verdaccio/types';

export const TIME_EXPIRATION_7D = '7d';

const defaultWebTokenOptions: JWTOptions = {
  sign: {
    // The expiration token for the website is 7 days
    expiresIn: TIME_EXPIRATION_7D,
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
