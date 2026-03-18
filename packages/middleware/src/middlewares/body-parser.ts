import buildDebug from 'debug';
import type { Router } from 'express';
import express from 'express';

import type { Config } from '@verdaccio/types';

const debug = buildDebug('verdaccio:middleware:body-parser');

/**
 * Check if a body parser is already registered on the router
 */
function hasBodyParser(app: Router): boolean {
  const stack = app.stack || [];
  return stack.some((middleware) => {
    return middleware.handle?.name === 'jsonParser' || middleware.name === 'jsonParser';
  });
}

/**
 * Register JSON body parser on a router if not already registered
 * @param app Express router instance
 * @param config Verdaccio config
 */
export function registerBodyParser(app: Router, config: Config): void {
  // middleware might have registered a json parser already
  if (hasBodyParser(app)) {
    debug('json parser already registered');
  } else {
    app.use(
      express.json({
        strict: false,
        limit: config.max_body_size || '10mb',
      })
    );
  }
}
