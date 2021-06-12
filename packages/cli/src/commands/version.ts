/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Command } from 'clipanion';

export class VersionCommand extends Command {
  static paths = [[`--version`], [`-v`]];

  async execute() {
    const version = require('../../package.json').version;
    this.context.stdout.write(`v${version}`);
    process.exit(0);
  }
}
