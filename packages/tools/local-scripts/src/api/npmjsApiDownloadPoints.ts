import { Command } from 'clipanion';

import { fetchMonthlyData, fetchYearlyData } from './utils';

export class FetchMonthlyDataCommand extends Command {
  public static paths = [['fetch-monthly-data']];

  public async execute() {
    try {
      await fetchMonthlyData();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    }
  }
}

export class FetchYearlyDataCommand extends Command {
  public static paths = [['fetch-yearly-data']];

  public async execute() {
    try {
      await fetchYearlyData();
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    }
  }
}
