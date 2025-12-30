import buildDebug from 'debug';

import { HEADERS } from '@verdaccio/core';

const debug = buildDebug('verdaccio:middleware:web:security');

export function setSecurityWebHeaders(_req, res, next): void {
  // disable loading in frames (clickjacking, etc.)
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options
  const framesOptions = res.getHeader(HEADERS.FRAMES_OPTIONS);
  if (!framesOptions || !(framesOptions === 'deny' || framesOptions === 'sameorigin')) {
    debug('Missing or invalid X-Frame-Options header; setting to "deny"');
    res.header(HEADERS.FRAMES_OPTIONS, 'deny');
  }

  // avoid establishing connections outside of domain
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy
  if (!res.getHeader(HEADERS.CSP)) {
    debug('Missing Content-Security-Policy header; setting to "connect-src \'self\'"');
    res.header(HEADERS.CSP, "connect-src 'self'");
  }

  // respect the content type of the response
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options
  const cto = res.getHeader(HEADERS.CTO);
  if (!cto || cto !== 'nosniff') {
    debug('Missing or invalid X-Content-Type-Options header; setting to "nosniff"');
    res.header(HEADERS.CTO, 'nosniff');
  }

  // block rendering of the page in case of XSS attack
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-XSS-Protection
  const xss = res.getHeader(HEADERS.XSS);
  if (!xss || !(xss === '0' || xss.startsWith('1'))) {
    debug('Missing or invalid X-XSS-Protection header; setting to "1; mode=block"');
    res.header(HEADERS.XSS, '1; mode=block');
  }
  next();
}
