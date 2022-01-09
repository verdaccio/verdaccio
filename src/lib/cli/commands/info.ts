import { Command } from 'clipanion';
import envinfo from 'envinfo';

export class InfoCommand extends Command {
  static paths = [[`--info`], [`-i`]];

  async execute() {
    this.context.stdout.write('\nEnvironment Info:');
    const data = await envinfo.run({
      System: ['OS', 'CPU'],
      Binaries: ['node', 'yarn', 'npm', 'pnpm'],
      Virtualization: ['Docker'],
      Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
      npmGlobalPackages: ['verdaccio'],
    });

    this.context.stdout.write(data);
    process.exit(0);
  }
}
