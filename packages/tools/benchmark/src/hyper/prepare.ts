#!/usr/bin/env node

import { fork, spawn } from 'child_process';
import semver from 'semver';
import { Cli, Command, Option } from 'clipanion';

const [node, app, ...args] = process.argv;

export class PrepareCommand extends Command {
  public static paths = [Command.Default];
  private version = Option.String('-v', {
    description: 'version to test',
    required: true,
  });
  private childFork;
  public async execute() {
    try {
      if (semver.valid(this.version)) {
        const childProcess = spawn(`npx`, [`verdaccio@${this.version}`], {
          detached: true,
          stdio: 'ignore',
        });
        childProcess.unref();
      } else if (this.version === 'local') {
        // eslint-disable-next-line no-console
        this.childFork = fork(`pnpx verdaccio@${this.version}`, {
          silent: false,
        });

        this.childFork.on('message', (msg) => {
          // verdaccio_started is a message that comes from verdaccio in debug mode that
          // notify has been started
          if ('verdaccio_started' in msg) {
            // eslint-disable-next-line no-console
            console.log(`verdaccio@v${this.version} has started`);
          }
        });
      } else {
        throw Error('version must be semver or local');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('error prepare', err);
      process.exit(1);
    }
  }
}

const cli = new Cli({
  binaryLabel: `benchmark-prepare`,
  binaryName: `${node} ${app}`,
  binaryVersion: '1.0.0',
});

cli.register(PrepareCommand);
cli.runExit(args, Cli.defaultContext);

process.on('uncaughtException', function (err) {
  // eslint-disable-next-line no-console
  console.error(
    // eslint-disable-next-line max-len
    `uncaught exception, please report (https://github.com/verdaccio/verdaccio/issues) this: \n${err.stack}`
  );
  process.exit(1);
});
