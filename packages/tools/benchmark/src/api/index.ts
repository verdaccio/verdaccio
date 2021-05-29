/* eslint-disable no-console */
import { Command, Option } from 'clipanion';
import runApi from './run';

export class ApiCommand extends Command {
  public static paths = [['api']];

  private fixture = Option.String('-f,--fixture', {
    description: 'fixture to run',
    required: true,
  });

  public async execute() {
    try {
      await runApi(this.fixture);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
