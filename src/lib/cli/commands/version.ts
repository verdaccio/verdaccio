import { Command } from 'clipanion';

require('pkginfo')(module);
const pkgVersion = module.exports.version;

export class VersionCommand extends Command {
  static paths = [[`--version`], [`-v`]];

  async execute() {
    this.context.stdout.write(`v${pkgVersion}`);
    process.exit(0);
  }
}
