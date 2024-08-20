import { Command, Option } from 'clipanion';

import { findConfigFile, parseConfigFile } from '@verdaccio/config';
import { warningUtils } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';
import { initServer } from '@verdaccio/node-api';
import { ConfigYaml, LoggerConfigItem } from '@verdaccio/types';

export const DEFAULT_PROCESS_NAME: string = 'verdaccio';

export class InitCommand extends Command {
  public static paths = [Command.Default];

  private port = Option.String('-l,-p,--listen,--port', {
    description: 'host:port number to listen on (default: localhost:4873)',
  });

  // eslint-disable-next-line
  static usage = Command.Usage({
    description: `launch the server`,
    details: `
      This start the registry in the default port.

      When used without arguments, it:

      - bootstrap the server at the port  \`4873\`

      The optional arguments are:

      - \`-l | --listen | -p | --port\` to switch the default server port,
      - \`-c | --config\` to define a different configuration path location,

    `,
    examples: [
      [`Runs the server with the default configuration`, `verdaccio`],
      [`Runs the server in the port 5000`, `verdaccio --listen 5000`],
      [
        `Runs the server by using a different absolute location of the configuration file`,
        `verdaccio --config /home/user/verdaccio/config.yaml`,
      ],
    ],
  });

  private config = Option.String('-c,--config', {
    description: 'use this configuration file (default: ./config.yaml)',
  });

  private initLogger(logConfig: ConfigYaml) {
    if (logConfig.logs) {
      logConfig.log = logConfig.logs;
      warningUtils.emit(warningUtils.Codes.VERWAR002);
    }
    setup(logConfig.log as LoggerConfigItem);
  }

  public async execute() {
    try {
      const configPathLocation = findConfigFile(this.config as string);
      const configParsed = parseConfigFile(configPathLocation);
      this.initLogger(configParsed);
      logger.info({ file: configPathLocation }, 'using config file: @{file}');
      const { web } = configParsed;

      process.title = web?.title || DEFAULT_PROCESS_NAME;

      const { version, name } = require('../../package.json');

      await initServer(configParsed, this.port as string, version, name);

      const logLevel = configParsed.log?.level || 'default';
      logger.info({ logLevel }, 'log level: @{logLevel}');
      logger.info('server started');
    } catch (err: any) {
      console.error(err);
      process.exit(1);
    }
  }
}
