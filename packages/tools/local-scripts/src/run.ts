import { Cli } from 'clipanion';

import { DockerPullCommand } from './api/dockerPullCommand';
import { NpmjsApiDownloadCommand } from './api/npmjsApiDownloadCommand';
import { FetchMonthlyDataCommand, FetchYearlyDataCommand } from './api/npmjsApiDownloadPoints';
import { TranslationsApiCommand } from './api/translationsCommand';

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `translations`,
  binaryName: `${node} ${app}`,
  binaryVersion: require('../package.json').version,
});

cli.register(TranslationsApiCommand);
cli.register(NpmjsApiDownloadCommand);
cli.register(DockerPullCommand);
cli.register(FetchMonthlyDataCommand);
cli.register(FetchYearlyDataCommand);
cli.runExit(args, Cli.defaultContext);

process.on('uncaughtException', function (err) {
  // eslint-disable-next-line no-console
  console.error(
    // eslint-disable-next-line max-len
    `uncaught exception, please report (https://github.com/verdaccio/verdaccio/issues) this: \n${err.stack}`
  );
  process.exit(1);
});
