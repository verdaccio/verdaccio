import { Command, Option } from 'clipanion';
import { findConfigFile, parseConfigFile } from '@verdaccio/config';
import { setup, logger } from '@verdaccio/logger';
import server from '@verdaccio/fastify-migration';
import { ConfigRuntime } from '@verdaccio/types';

export const DEFAULT_PROCESS_NAME: string = 'verdaccio';

/**
 * This command is intended to run the server with Fastify
 * as a migration step.
 */
export class NewServer extends Command {
  public static paths = [['new']];

  private port = Option.String('-l,-p,--listen,--port', {
    description: 'host:port number to listen on (default: localhost:4873)',
  });

  private config = Option.String('-c,--config', {
    description: 'use this configuration file (default: ./config.yaml)',
  });

  private initLogger(logConfig: ConfigRuntime) {
    try {
      if (logConfig.logs) {
        process.emitWarning('config.logs is deprecated, rename configuration to "config.log"');
      }
      // FUTURE: remove fallback when is ready
      setup(logConfig.log || logConfig.logs);
    } catch {
      throw new Error('error on init logger');
    }
  }

  public async execute() {
    try {
      const configPathLocation = findConfigFile(this.config as string);
      const configParsed = parseConfigFile(configPathLocation);
      const { web } = configParsed;
      this.initLogger(configParsed);

      process.title = web?.title || DEFAULT_PROCESS_NAME;
      // const { version, name } = require('../../package.json');
      const ser = await server({ logger, config: configParsed });
      await ser.listen(4873);
    } catch (err: any) {
      console.error(err);
      process.exit(1);
    }
  }
}
