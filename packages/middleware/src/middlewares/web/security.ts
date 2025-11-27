import { HEADERS } from '@verdaccio/core';

export function setSecurityWebHeaders(_req, res, next): void {
  // disable loading in frames (clickjacking, etc.)
  if (!res.get(HEADERS.FRAMES_OPTIONS)) {
    res.header(HEADERS.FRAMES_OPTIONS, 'deny');
  }
  // avoid establishing connections outside of domain
  if (!res.get(HEADERS.CSP)) {
    res.header(HEADERS.CSP, "connect-src 'self'");
  }
  // https://stackoverflow.com/questions/18337630/what-is-x-content-type-options-nosniff
  if (!res.get(HEADERS.CTO)) {
    res.header(HEADERS.CTO, 'nosniff');
  }
  // https://stackoverflow.com/questions/9090577/what-is-the-http-header-x-xss-protection
  if (!res.get(HEADERS.XSS)) {
    res.header(HEADERS.XSS, '1; mode=block');
  }
  next();
}
