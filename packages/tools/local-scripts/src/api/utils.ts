import { Credentials, TranslationStatus } from '@crowdin/crowdin-api-client';
import fs from 'fs/promises';
import got from 'got';
import path from 'path';

const debug = require('debug')('verdaccio:local-scripts');

const token = process.env.TOKEN || '';
const START_YEAR = 2016;
const END_YEAR = new Date().getFullYear();
const END_MONTH = new Date().getMonth() + 1;
const API_URL = 'https://api.npmjs.org/downloads/point';
const PACKAGE_NAME = 'verdaccio';

export const getISODateOnly = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

async function fetchDownloadData(
  year: number,
  month: number
): Promise<{ downloads: number; start: string; end: string; package: string } | null> {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
  const url = `${API_URL}/${startDate}:${endDate}/${PACKAGE_NAME}`;

  try {
    const response = await got.get(url).json();
    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to fetch data for ${startDate} to ${endDate}:`, error);
    return null;
  }
}

export async function fetchMonthlyData() {
  const results = [];
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === END_YEAR && month > END_MONTH) break;
      const data = await fetchDownloadData(year, month);
      if (data) results.push(data);
    }
  }
  await fs.writeFile('monthly_downloads.json', JSON.stringify(results, null, 2));
  debug('Monthly data saved to monthly_downloads.json');
}

export async function fetchYearlyData() {
  const results: { [key: string]: number } = {};
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    let yearlyTotal = 0;
    for (let month = 1; month <= 12; month++) {
      if (year === END_YEAR && month > END_MONTH) break;
      const data = await fetchDownloadData(year, month);
      if (data) yearlyTotal += data.downloads;
    }
    results[year.toString()] = yearlyTotal;
  }
  await fs.writeFile('yearly_downloads.json', JSON.stringify(results, null, 2));
  debug('Yearly data saved to yearly_downloads.json');
}

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
    debug('translations written at %s ends', location);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(`error on process crowdin translations run`, err);
    process.exit(1);
  }
}
