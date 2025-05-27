import { TOKEN_VALID_LENGTH, generateRandomSecretKey } from '@verdaccio/config';
import { cryptoUtils } from '@verdaccio/core';

// @deprecated use @verdaccio/core.cryptoUtils instead
export const defaultTarballHashAlgorithm = cryptoUtils.defaultTarballHashAlgorithm;
// @deprecated use @verdaccio/core.cryptoUtils instead
export const stringToMD5 = cryptoUtils.stringToMD5;
// @deprecated use @verdaccio/core.cryptoUtils instead
export const createTarballHash = cryptoUtils.createTarballHash;
// @deprecated use @verdaccio/core.cryptoUtils instead
export const generateRandomHexString = cryptoUtils.generateRandomHexString;

// @deprecated use @verdaccio/config instead
export { TOKEN_VALID_LENGTH, generateRandomSecretKey };
