/* eslint-disable no-console */
import { spawn } from 'child_process';
import path from 'path';

import { Command, Option } from 'clipanion';

export class HyperCommand extends Command {
  public static paths = [['hyper']];

  private fixture = Option.String('-f', {
    description: 'fixture to run',
    required: true,
  });

  private version = Option.String('-v', {
    description: '',
    required: true,
  });

  private report = Option.String('-r', {
    description: 'report path',
    required: true,
  });

  public async execute() {
    try {
      const prepare = path.resolve(__dirname, 'prepare.js');
      const run = path.resolve(__dirname, 'run-scenario.js');
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
          '50',
          '--show-output',
          `--prepare`,
          `${prepare} -v ${this.version}`,
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
