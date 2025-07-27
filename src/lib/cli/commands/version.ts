import { Command } from 'clipanion';

const pkgVersion = process.env.PACKAGE_VERSION || 'dev';

export class VersionCommand extends Command {
  static paths = [[`--version`], [`-v`]];

  async execute() {
    this.context.stdout.write(`v${pkgVersion}\n`);
    process.exit(0);
  }
}
