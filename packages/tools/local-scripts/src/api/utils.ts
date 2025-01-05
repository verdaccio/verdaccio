import { Credentials, TranslationStatus } from '@crowdin/crowdin-api-client';
import fs from 'fs/promises';
import got from 'got';
import path from 'path';

const debug = require('debug')('verdaccio:local-scripts');

const token = process.env.TOKEN || '';

const getISODateOnly = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export async function fetchNpmjsApiDownloadsWeekly() {
  try {
    const npmjsFile = path.join(__dirname, '../../src/npmjs_downloads.json');
    const currentDate = getISODateOnly();
    debug('current date %s', currentDate);
    const npmjsDownloads = JSON.parse(await fs.readFile(npmjsFile, 'utf8'));
    if (npmjsDownloads[currentDate]) {
      // eslint-disable-next-line no-console
      console.info('already fetched for today');
      return;
    }

    const response = await got('https://api.npmjs.org/versions/verdaccio/last-week', {
      responseType: 'json',
    });

    npmjsDownloads[currentDate] = response.body.downloads;

    await fs.writeFile(npmjsFile, JSON.stringify(npmjsDownloads, null, 4));
    debug('npmjs downloads written at %s ends', npmjsFile);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(`error on process npmjs downloads run`, err);
    process.exit(1);
  }
}

export async function dockerPullWeekly() {
  try {
    const npmjsFile = path.join(__dirname, '../../src/docker_pull.json');
    const currentDate = getISODateOnly();
    debug('current date %s', currentDate);
    const pullCounts = JSON.parse(await fs.readFile(npmjsFile, 'utf8'));

    const response = await got(
      'https://hub.docker.com/api/publisher/proxylytics/v1/repos/pulls?repos=verdaccio/verdaccio',
      {
        responseType: 'json',
      }
    );
    const currentPulls = response.body.repos['verdaccio/verdaccio'].pulls;
    currentPulls.forEach(({ end, pullCount, ipCount }) => {
      if (pullCounts[end]) {
        // eslint-disable-next-line no-console
        console.info(`docker ${end} already fetched`);
        return;
      }
      pullCounts[end] = {
        pullCount,
        ipCount,
      };
    });
    await fs.writeFile(npmjsFile, JSON.stringify(pullCounts, null, 4));
    debug('npmjs downloads written at %s ends', npmjsFile);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(`error on process npmjs downloads run`, err);
    process.exit(1);
  }
}

export async function fetchTranslationsAPI() {
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
    await fs.writeFile(location, JSON.stringify(final, null, 4));
    // eslint-disable-next-line no-console
    console.log('translations written at %s ends', location);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(`error on process crowdin translations run`, err);
    process.exit(1);
  }
}
