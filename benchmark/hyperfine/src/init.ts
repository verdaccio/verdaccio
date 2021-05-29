/* eslint-disable no-console */
import { spawn } from 'child_process';
import path from 'path';

import { Cli, Command, Option } from 'clipanion';

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `verdaccio`,
  binaryName: `${node} ${app}`,
  binaryVersion: require('../package.json').version,
});

class InitCommand extends Command {
  public static paths = [Command.Default];

  private fixture = Option.String('-f,--fixture', {
    description: 'fixture to run',
    required: true,
  });

  private version = Option.String('-v,--version', {
    description: '',
    required: true,
  });

  private report = Option.String('-r,--report', {
    description: 'report path',
    required: true,
  });

  public async execute() {
    try {
      const prepare = path.resolve(__dirname, 'prepare.ts');
      const run = path.resolve(__dirname, 'run-scenario.ts');
      console.log('-prepare-', prepare);
      console.log('-run-', run);

      const hyperfine = spawn(
        'hyperfine',
        [
          '--ignore-failure',
          '--warmup',
          '1',
          '--export-json',
          `${path.resolve(__dirname, this.report)}`,
          '--runs',
          '2',
          '--show-output',
          `--prepare -v ${this.version}`,
          `${prepare}`,
          `${run} -f ${this.fixture}`,
        ],
        { stdio: 'inherit' }
      );

      // @ts-expect-error
      console.log('status', hyperfine.status);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}

cli.register(InitCommand);
cli.runExit(args, Cli.defaultContext);

process.on('uncaughtException', function (err) {
  console.error(
    // eslint-disable-next-line max-len
    `uncaught exception, please report (https://github.com/verdaccio/verdaccio/issues) this: \n${err.stack}`
  );
  process.exit(1);
});
