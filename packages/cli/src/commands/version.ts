import { Command } from 'clipanion';

import { pkgUtils } from '@verdaccio/core';

import { getVersionOverride } from '../runtime';

export class VersionCommand extends Command {
  static paths = [[`--version`], [`-v`]];

  async execute() {
    const currentDir = typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname;
    const version = getVersionOverride() ?? pkgUtils.getPackageJson(currentDir, '../..').version;
    this.context.stdout.write(`v${version}\n`);
    process.exit(0);
  }
}
