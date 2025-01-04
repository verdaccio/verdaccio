import { Command } from 'clipanion';

import { dockerPullWeekly } from './utils';

export class DockerPullCommand extends Command {
  public static paths = [['docker-pull-api-download']];

  public async execute() {
    try {
      await dockerPullWeekly();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    }
  }
}
