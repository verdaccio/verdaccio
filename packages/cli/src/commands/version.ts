import { Command } from 'clipanion';

import { pkgUtils } from '@verdaccio/core';

import { getVersionOverride } from '../runtime';

export class VersionCommand extends Command {
  static paths = [[`--version`], [`-v`]];

  async execute() {
    const version = getVersionOverride() ?? pkgUtils.getPackageVersion('../..');
    this.context.stdout.write(`v${version}\n`);
    process.exit(0);
  }
}
