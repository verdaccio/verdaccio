import { Credentials, TranslationStatus } from '@crowdin/crowdin-api-client';
import fs from 'fs/promises';
import path from 'path';

const debug = require('debug')('verdaccio:website');

const token = process.env.TOKEN || '';

export default async function run() {
  try {
    debug('api report start');
    const credentials: Credentials = {
      token,
    };
    const api: TranslationStatus = new TranslationStatus(credentials);
    const progress = await api.getProjectProgress(295539, { limit: 100 });
    const final = progress.data.reduce((acc, item) => {
      const { languageId, translationProgress, approvalProgress } = item.data;
      // @ts-ignore
      acc[languageId] = { translationProgress, approvalProgress };
      return acc;
    }, {});
    const location = path.join(__dirname, '../../src/progress_lang.json');
    fs.writeFile(location, JSON.stringify(final, null, 4));
    // eslint-disable-next-line no-console
    console.log('translations written at %s ends', location);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(`error on process crowdin translations run`, err);
    process.exit(1);
  }
}
