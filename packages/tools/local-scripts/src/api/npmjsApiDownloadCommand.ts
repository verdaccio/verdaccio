import { Command } from 'clipanion';

import { fetchNpmjsApiDownloadsWeekly } from './utils';

export class NpmjsApiDownloadCommand extends Command {
  public static paths = [['npmjs-api-download']];

  public async execute() {
    try {
      await fetchNpmjsApiDownloadsWeekly();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    }
  }
}
