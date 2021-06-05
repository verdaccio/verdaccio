/* eslint-disable no-console */
import { Command, Option } from 'clipanion';
import runApi from './run';

export class ApiCommand extends Command {
  public static paths = [['api']];

  private benchmark = Option.String('-f', {
    description: 'benchmark to run',
    required: true,
  });

  private version = Option.String('-v', {
    description: 'version is running',
    required: true,
  });

  public async execute() {
    try {
      await runApi(this.benchmark, this.version);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
