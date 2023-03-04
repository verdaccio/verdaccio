import { Command } from 'clipanion';

import runApi from './run';

export class ApiCommand extends Command {
  public static paths = [['translations']];

  public async execute() {
    try {
      await runApi();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    }
  }
}
