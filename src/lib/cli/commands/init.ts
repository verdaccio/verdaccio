import { Command, Option } from 'clipanion';
import _ from 'lodash';
import path from 'path';
import URL from 'url';

import { findConfigFile, getListenAddress } from '@verdaccio/config';

import { logger } from '../../logger';
import { runServer } from '../../run-server';
import { parseConfigFile } from '../../utils';

const pkgVersion = process.env.PACKAGE_VERSION || 'dev';
const pkgName = 'verdaccio';

export const DEFAULT_PROCESS_NAME: string = 'verdaccio';

export class InitCommand extends Command {
  static paths = [Command.Default];

  listen = Option.String('-l,--listen', {
    description: 'host:port number to listen on (default: localhost:4873)',
  });

  static usage = Command.Usage({
    description: `launch the server`,
    details: `
      This start the registry in the default port.

      When used without arguments, it:

      - bootstrap the server at the port  \`4873\`

      The optional arguments are:

      - \`--listen\` to switch the default server port,
      - \`--config\` to define a different configuration path location,

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

  config = Option.String('-c,--config', {
    description: 'use this configuration file (default: ./config.yaml)',
  });

  async execute() {
    let configPathLocation;
    try {
      configPathLocation = findConfigFile(this.config as string);
      const configParsed: ReturnType<any> = parseConfigFile(configPathLocation);
      if (!configParsed.self_path) {
        configParsed.self_path = path.resolve(configPathLocation);
        // compatibility with 6.x plugins
        configParsed.configPath = configParsed.self_path;
      }
      if (!configParsed.https) {
        configParsed.https = { enable: false };
      }

      process.title = (configParsed.web && configParsed.web.title) || 'verdaccio';

      const serverFactory = await runServer(configParsed, {
        listenArg: this.listen as string,
      });

      const listen = this.listen ?? configParsed?.listen;
      const addr = getListenAddress(listen, logger);

      const server = serverFactory
        .listen(addr.port || addr.path, addr.host, (): void => {
          if (_.isFunction(process.send)) {
            process.send({
              verdaccio_started: true,
            });
          }
        })
        .on('error', function (err): void {
          logger.fatal({ err: err }, 'cannot create http server: @{err.message}');
          process.exit(2);
        });

      function handleShutdownGracefully() {
        logger.fatal('received shutdown signal - closing server gracefully...');
        server.close(() => {
          logger.info('server closed.');
          process.exit(0);
        });
      }

      process.on('SIGINT', handleShutdownGracefully);
      process.on('SIGTERM', handleShutdownGracefully);
      process.on('SIGHUP', handleShutdownGracefully);

      logger.warn(
        {
          addr: addr.path
            ? URL.format({
                protocol: 'unix',
                pathname: addr.path,
              })
            : URL.format({
                protocol: addr.proto,
                hostname: addr.host,
                port: addr.port,
                pathname: '/',
              }),
          version: pkgName + '/' + pkgVersion,
        },
        'http address - @{addr} - @{version}'
      );

      logger.info({ file: configPathLocation }, 'config file  - @{file}');
    } catch (err: any) {
      console.error(`cannot open config file ${configPathLocation}: ${err.stack}`);
      // @ts-expect-error
      if (typeof logger?.logger?.fatal === 'function') {
        logger.fatal(
          { file: configPathLocation, err: err },
          'cannot open config file @{file}: @{!err.message}'
        );
      } else {
        console.error(`cannot open config file ${configPathLocation}: ${!err.message}`);
      }
      process.exit(1);
    }
  }
}
