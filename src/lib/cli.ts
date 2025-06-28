#!/usr/bin/env node
import './cli/cli';
import { logger } from './logger';

// ESM-friendly version of root-check
if (typeof process.getuid === 'function' && process.getuid() === 0) {
  process.emitWarning(`Verdaccio doesn't need superuser privileges. Don't run it under root.`);
}

process.on('uncaughtException', (err: unknown) => {
  logger?.fatal?.({ err }, 'uncaught exception, please report this\n@{err.stack}');
  process.exit(255);
});
