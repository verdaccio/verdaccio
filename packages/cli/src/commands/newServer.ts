import { Command, Option } from 'clipanion';
import { findConfigFile, parseConfigFile } from '@verdaccio/config';
import server from '@verdaccio/fastify-migration';

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

  public async execute() {
    try {
      const configPathLocation = findConfigFile(this.config as string);
      const configParsed = parseConfigFile(configPathLocation);
      const { web } = configParsed;

      process.title = web?.title || DEFAULT_PROCESS_NAME;
      // const { version, name } = require('../../package.json');
      const ser = await server();
      await ser.listen(4000);
      console.log('fastify running on port 4000');
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
