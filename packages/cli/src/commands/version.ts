/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Command } from 'clipanion';

import { pkgUtils } from '@verdaccio/core';

export class VersionCommand extends Command {
  static paths = [[`--version`], [`-v`]];

  async execute() {
    const { version } = pkgUtils.getPackageJson(__dirname, '../..');
    this.context.stdout.write(`v${version}\n`);
    process.exit(0);
  }
}
