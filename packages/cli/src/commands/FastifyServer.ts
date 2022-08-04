// import { Command, Option } from 'clipanion';

// import { findConfigFile, parseConfigFile } from '@verdaccio/config';
// import server from '@verdaccio/fastify-migration';
// import { logger, setup } from '@verdaccio/logger';
// import { ConfigYaml } from '@verdaccio/types';

// export const DEFAULT_PROCESS_NAME: string = 'verdaccio';

// /**
//  * This command is intended to run the server with Fastify
//  * as a migration step.
//  * More info: https://github.com/verdaccio/verdaccio/discussions/2155
//  * To try out.
//  * pnpm debug:fastify
//  */
// export class FastifyServer extends Command {
//   public static paths = [['fastify-server']];

//   private port = Option.String('-l,-p,--listen,--port', {
//     description: 'host:port number to listen on (default: localhost:4873)',
//   });

//   private config = Option.String('-c,--config', {
//     description: 'use this configuration file (default: ./config.yaml)',
//   });

//   private initLogger(logConfig: ConfigYaml) {
//     try {
//       if (logConfig.log) {
//         throw Error('logger as array not longer supported');
//       }
//       // FUTURE: remove fallback when is ready
//       setup(logConfig.log);
//     } catch (err: any) {
//       throw new Error(err);
//     }
//   }

//   public async execute() {
//     try {
//       const configPathLocation = findConfigFile(this.config as string);
//       const configParsed = parseConfigFile(configPathLocation);
//       const { web } = configParsed;
//       this.initLogger(configParsed);

//       process.title = web?.title || DEFAULT_PROCESS_NAME;
//       // FIXME: need a way to get version of the package.
//       // const { version, name } = require('../../package.json');
//       const ser = await server({ logger, config: configParsed });
//       // FIXME: harcoded, this would need to come from the configuration and the --listen flag.
//       await ser.listen(process.env.PORT || 4873);
//     } catch (err: any) {
//       console.error(err);
//       process.exit(1);
//     }
//   }
// }
