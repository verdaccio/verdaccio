import { Command } from 'clipanion';

import { pkgUtils } from '@verdaccio/core';

export class VersionCommand extends Command {
  static paths = [[`--version`], [`-v`]];

  async execute() {
    const currentDir = typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname;
    const { version } = pkgUtils.getPackageJson(currentDir, '../..');
    this.context.stdout.write(`v${version}\n`);
    process.exit(0);
  }
}
