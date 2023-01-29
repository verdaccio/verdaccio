import { HEADERS } from '@verdaccio/core';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

// TODO: remove, was relocated to web package
// @ts-deprecated
export function setSecurityWebHeaders(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  // disable loading in frames (clickjacking, etc.)
  res.header(HEADERS.FRAMES_OPTIONS, 'deny');
  // avoid stablish connections outside of domain
  res.header(HEADERS.CSP, "connect-src 'self'");
  // https://stackoverflow.com/questions/18337630/what-is-x-content-type-options-nosniff
  res.header(HEADERS.CTO, 'nosniff');
  // https://stackoverflow.com/questions/9090577/what-is-the-http-header-x-xss-protection
  res.header(HEADERS.XSS, '1; mode=block');
  next();
}
