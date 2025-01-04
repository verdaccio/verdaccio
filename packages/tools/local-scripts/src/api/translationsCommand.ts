import { Command } from 'clipanion';

import { fetchTranslationsAPI } from './utils';

export class TranslationsApiCommand extends Command {
  public static paths = [['translations']];

  public async execute() {
    try {
      // fetch translations api and write to file
      await fetchTranslationsAPI();
      // fetch npmjs downloads api and write to file

      // fetch docker downloads api and write to file
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    }
  }
}
