import {
  formatLicense,
  formatRepository,
  formatDate,
  formatDateDistance,
  getLastUpdatedPackageTime,
  getRecentReleases
} from '../../../../src/webui/utils/package';

import { packageMeta } from '../components/store/packageMeta';

describe('formatLicense', () => {
  test('should check license field different values', () => {
    expect(formatLicense('MIT')).toEqual('MIT');
  });
  test('should check license field for object value', () => {
    const license = { type: 'ISC', url: 'https://opensource.org/licenses/ISC' };
    expect(formatLicense(license)).toEqual('ISC');
  });
  test('should check license field for other value', () => {
    expect(formatLicense(null)).toBeNull();
    expect(formatLicense({})).toBeNull();
    expect(formatLicense([])).toBeNull();
  });
});

describe('formatRepository', () => {
  test('should check repository field different values', () => {
    const repository = 'https://github.com/verdaccio/verdaccio';
    expect(formatRepository(repository)).toEqual(repository);
  });
  test('should check repository field for object value', () => {
    const license = {
      type: 'git',
      url: 'https://github.com/verdaccio/verdaccio'
    };
    expect(formatRepository(license)).toEqual(license.url);
  });
  test('should check repository field for other value', () => {
    expect(formatRepository(null)).toBeNull();
    expect(formatRepository({})).toBeNull();
    expect(formatRepository([])).toBeNull();
  });
});

describe('formatDate', () => {
  test('should format the date', () => {
    const date = 1532211072138;
    expect(formatDate(date)).toEqual('21.07.2018, 22:11:12');
  });
});

describe('formatDateDistance', () => {
  test('should calculate the distance', () => {
    const dateTwoMonthsAgo = () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 2);
      return date;
    };
    const date = dateTwoMonthsAgo();
    expect(formatDateDistance(date)).toEqual('about 2 months');
  });
});

describe('getLastUpdatedPackageTime', () => {
  test('should get the last update time', () => {
    const lastUpdated = packageMeta._uplinks;
    expect(getLastUpdatedPackageTime(lastUpdated)).toEqual(
      '22.07.2018, 22:11:12'
    );
  });
  test('should get the last update time for blank uplink', () => {
    const lastUpdated = {};
    expect(getLastUpdatedPackageTime(lastUpdated)).toEqual('');
  });
});

describe('getRecentReleases', () => {
  test('should get the recent releases', () => {
    const { time } = packageMeta;
    const result = [
      { time: '14.12.2017, 15:43:27', version: '2.7.1' },
      { time: '05.12.2017, 23:25:06', version: '2.7.0' },
      { time: '08.11.2017, 22:47:16', version: '2.6.6' }
    ];
    expect(getRecentReleases(time)).toEqual(result);
    expect(getRecentReleases()).toEqual([]);
  });
});
