import LRU from "lru-cache";
import { isUUID } from "./crypto-utils"
import { IStorageHandler } from '../../types';

const blacklistCache = new LRU({
  max: 10000,
  maxAge: 1000 * 60 * 60 * 24 // 24h
});

// currently only manually created tokens via the token command can be validated
// as verdaccio only stores these tokens in the storage handler
export async function isTokenRevoked(name: string, tokenKey: string, storage: IStorageHandler): Promise<boolean> {
  if (!isUUID(tokenKey)){
    // if tokenKey is a UUID it is a unique jwtid and originates from a manually generated jwt token (npm comman)
    // else it will be an non-identifiable token (jwt or legacy) and can not be validated in absence of an unqiue identifier
    // we should skip
    return false;
  }

  // validate if tokenIdentifier is already listed in memory cache
  const tokenIdentifier = `${name}:${tokenKey}`;
  let blacklisted = blacklistCache.get(tokenIdentifier) as boolean | undefined;
  if (blacklisted !== undefined) { 
    return blacklisted;
  }

  // validate if tokenKey is part of user token storage
  // a fallback lookup; store in memory cache if token is not found
  try {
    const tokens = await storage.readTokens({user: name})
    blacklisted = tokens.find((token) => token.key === tokenKey) === undefined;
    if (blacklisted) blacklistCache.set(tokenIdentifier, true)
  } catch (err) {
    // issue with access to storage pass for now
    blacklisted = false;
  }

  return blacklisted;
}
