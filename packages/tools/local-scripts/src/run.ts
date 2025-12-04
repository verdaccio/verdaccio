import { Cli } from 'clipanion';
import fs from 'node:fs';
import path from 'node:path';

import { DockerPullCommand } from './api/dockerPullCommand';
import { NpmjsApiDownloadCommand } from './api/npmjsApiDownloadCommand';
import { FetchMonthlyDataCommand, FetchYearlyDataCommand } from './api/npmjsApiDownloadPoints';
import { TranslationsApiCommand } from './api/translationsCommand';

const [node, app, ...args] = process.argv;

const getPackageJson = () => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
};

const cli = new Cli({
  binaryLabel: `translations`,
  binaryName: `${node} ${app}`,
  binaryVersion: getPackageJson().version as string,
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
