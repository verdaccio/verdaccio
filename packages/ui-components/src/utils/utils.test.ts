import MockDate from 'mockdate';

import { packageMeta } from './__partials__/packageMeta';
import {
  fileSizeSI,
  formatDate,
  formatDateDistance,
  formatLicense,
  formatRepository,
  getLastUpdatedPackageTime,
  getRecentReleases,
  getUplink,
} from './utils';

// jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
// Date.now = jest.fn(() => 1487076708000);

describe('formatLicense', (): void => {
  beforeEach(() => {
    MockDate.set(new Date());
  });

  afterEach(() => {
    MockDate.reset();
  });

  test('should check license field different values', (): void => {
    expect(formatLicense('MIT')).toEqual('MIT');
  });

  test('should check license field for object value', (): void => {
    const license = { type: 'ISC', url: 'https://opensource.org/licenses/ISC' };
    expect(formatLicense(license)).toEqual('ISC');
  });

  test('should check license field for other value', (): void => {
    expect(formatLicense(null)).toBeUndefined();
    expect(formatLicense({})).toBeUndefined();
    expect(formatLicense([])).toBeUndefined();
  });
});

describe('formatRepository', (): void => {
  test('should check repository field different values', (): void => {
    const repository = 'https://github.com/verdaccio/verdaccio';
    expect(formatRepository(repository)).toEqual(repository);
  });

  test('should check repository field for object value', (): void => {
    const license = {
      type: 'git',
      url: 'https://github.com/verdaccio/verdaccio',
    };
    expect(formatRepository(license)).toEqual(license.url);
  });

  test('should check repository field for other value', (): void => {
    expect(formatRepository(null)).toBeNull();
    expect(formatRepository({})).toBeNull();
    expect(formatRepository([])).toBeNull();
  });
});

describe('formatDate', (): void => {
  test('should format the date', (): void => {
    const date = 1532211072138;
    expect(formatDate(date)).toEqual('07/21/2018 10:11:12 PM');
  });
});

describe('formatDateDistance', (): void => {
  test('should calculate the distance', (): void => {
    // const dateAboutTwoMonthsAgo = () => {
    //   const date = new Date();
    //   date.setMonth(date.getMonth() - 1);
    //   date.setDate(date.getDay() - 20);
    //   return date;
    // };
    const dateTwoMonthsAgo = (): Date => {
      const date = new Date();
      date.setMonth(date.getMonth() - 2);
      return date;
    };
    // const date1 = dateAboutTwoMonthsAgo();
    const date2 = dateTwoMonthsAgo();
    // FIXME: we need to review this expect, fails every x time.
    // expect(formatDateDistance(date1)).toEqual('about 2 months');
    expect(formatDateDistance(date2)).toEqual('2 months ago');
  });
});

describe('getLastUpdatedPackageTime', (): void => {
  test('should get the last update time', (): void => {
    const lastUpdated = packageMeta._uplinks;
    expect(getLastUpdatedPackageTime(lastUpdated)).toEqual('07/22/2018 10:11:12 PM');
  });

  test('should get the last update time for blank uplink', (): void => {
    const lastUpdated = {};
    expect(getLastUpdatedPackageTime(lastUpdated)).toEqual('');
  });
});

describe('getRecentReleases', (): void => {
  test('should get the recent releases', (): void => {
    const { time } = packageMeta;
    const result = [
      { time: '12/14/2017 3:43:27 PM', version: '2.7.1' },
      { time: '12/05/2017 11:25:06 PM', version: '2.7.0' },
      { time: '11/08/2017 10:47:16 PM', version: '2.6.6' },
    ];
    expect(getRecentReleases(time)).toEqual(result);
    expect(getRecentReleases()).toEqual([]);
  });
});

describe('getUplink', (): void => {
  test('getUplink for npmjs', () => {
    expect(getUplink('npmjs', 'semver')).toEqual('https://www.npmjs.com/package/semver');
  });

  test('getUplink for server1', () => {
    expect(getUplink('server1', 'semver')).toEqual(null);
  });
});

describe('fileSizeSI', (): void => {
  test('fileSizeSI as number 1234567', () => {
    expect(fileSizeSI(1234567)).toEqual('1.2 MB');
  });

  test('fileSizeSI as number 9876', () => {
    expect(fileSizeSI(9876)).toEqual('9.9 kB');
  });

  test('fileSizeSI as number 1000', () => {
    expect(fileSizeSI(1000)).toEqual('1.0 kB');
  });

  test('fileSizeSI as number 123', () => {
    expect(fileSizeSI(123)).toEqual('123 Bytes');
  });

  test('fileSizeSI as number 0', () => {
    expect(fileSizeSI(0)).toEqual('0 Bytes');
  });
});
