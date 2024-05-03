export {
  aesDecryptDeprecated,
  aesEncryptDeprecated,
  generateRandomSecretKeyDeprecated,
  TOKEN_VALID_LENGTH_DEPRECATED,
  defaultAlgorithm,
  defaultTarballHashAlgorithm,
} from './legacy-crypto';
// Temporary export to keep backward compatibility with Node.js >= 22
export {
  aesDecryptDeprecatedBackwardCompatible,
  aesEncryptDeprecatedBackwardCompatible,
} from './legacy-backward-compatible';
