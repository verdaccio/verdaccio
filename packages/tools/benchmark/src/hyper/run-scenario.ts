#!/usr/bin/env node

import { fork, spawn } from 'child_process';
import semver from 'semver';
import { Cli, Command, Option } from 'clipanion';
import getPort from 'get-port';

/* eslint-disable no-console */
const fetch = require('node-fetch');

const [node, app, ...args] = process.argv;

export class FixtureCommand extends Command {
  public static paths = [['run']];
  private childFork;
  private fixture = Option.String('-f', {
    description: 'fixture to test',
    required: true,
  });

  private version = Option.String('-v', {
    description: 'version to test',
    required: true,
  });

  private async prepareServer(port): Promise<void> {
    return new Promise((resolve, reject) => {
      if (semver.valid(this.version)) {
        this.childFork = spawn(`npx`, [`verdaccio@${this.version}`, '--listen', `0.0.0.0:${port}`]);
        this.childFork.stdout.on('data', function (data) {
          console.log(data.toString());
          if (data.toString().match(/http/)) {
            resolve();
          }
        });
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
            return resolve();
          }
        });
      } else {
        reject(Error('version must be semver or local'));
      }
    });
  }

  public async execute() {
    try {
      const port = await getPort();
      console.log('port->', port);
      await this.prepareServer(port);
      // eslint-disable-next-line no-console
      await fetch(this.fixture.replace('{port}', port));
      this.childFork.stdin.pause();
      this.childFork.kill();
      process.exit(0);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('run hyper failed:', err);
      process.exit(1);
    }
  }
}

const cli = new Cli({
  binaryLabel: `benchmark-run`,
  binaryName: `${node} ${app}`,
  binaryVersion: '1.0.0',
});

cli.register(FixtureCommand);
cli.runExit(args, Cli.defaultContext);

process.on('uncaughtException', function (err) {
  // eslint-disable-next-line no-console
  console.error(
    // eslint-disable-next-line max-len
    `uncaught exception, please report (https://github.com/verdaccio/verdaccio/issues) this: \n${err.stack}`
  );
  process.exit(1);
});
