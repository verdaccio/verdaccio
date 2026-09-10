import { Command, Option } from 'clipanion';

import { getEnvInfo } from './env-info';

export class InfoCommand extends Command {
  public static paths = [[`--info`], [`-i`]];

  public mask = Option.Boolean(`--mask`, false, {
    description: `obscure file paths in the report (keeps the structure, hides the names)`,
  });

  public async execute(): Promise<void> {
    this.context.stdout.write(await getEnvInfo(this.mask));
    process.exit(0);
  }
}
