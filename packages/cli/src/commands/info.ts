import envinfo from 'envinfo';
import { Command } from 'clipanion';

export class InfoCommand extends Command {
  public static paths = [[`--info`], [`-i`]];

  public async execute(): Promise<void> {
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
