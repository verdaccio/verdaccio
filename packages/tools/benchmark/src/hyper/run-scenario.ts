import { Cli, Command, Option } from 'clipanion';

/* eslint-disable no-console */
const fetch = require('node-fetch');

const [node, app, ...args] = process.argv;

export class FixtureCommand extends Command {
  public static paths = [Command.Default];
  private fixture = Option.String('-f', {
    description: 'fixture to test',
    required: true,
  });
  public async execute() {
    try {
      // eslint-disable-next-line no-console
      await fetch(this.fixture);
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
