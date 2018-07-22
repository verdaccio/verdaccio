import {
  formatLicense,
  formatRepository,
  formatAuthor,
  formatDate,
  formatDateDistance,
  getLastUpdatedPackageTime,
  getRecentReleases
} from '../../../../src/webui/utils/package';

import { packageMeta } from '../components/store/packageMeta';

describe('formatLicense', () => {
  it('should check license field different values', () => {
    expect(formatLicense('MIT')).toEqual('MIT');
  });
  it('should check license field for object value', () => {
    const license = { type: 'ISC', url: 'https://opensource.org/licenses/ISC' };
    expect(formatLicense(license)).toEqual('ISC');
  });
  it('should check license field for other value', () => {
    expect(formatLicense(null)).toBeNull();
    expect(formatLicense({})).toBeNull();
    expect(formatLicense([])).toBeNull();
  });
});

describe('formatRepository', () => {
  it('should check repository field different values', () => {
    const repository = 'https://github.com/verdaccio/verdaccio';
    expect(formatRepository(repository)).toEqual(repository);
  });
  it('should check repository field for object value', () => {
    const license = {
      type: 'git',
      url: 'https://github.com/verdaccio/verdaccio'
    };
    expect(formatRepository(license)).toEqual(license.url);
  });
  it('should check repository field for other value', () => {
    expect(formatRepository(null)).toBeNull();
    expect(formatRepository({})).toBeNull();
    expect(formatRepository([])).toBeNull();
  });
});

describe('formatAuthor', () => {
  it('should check author field different values', () => {
    const author = 'verdaccioNpm';
    expect(formatAuthor(author)).toEqual(author);
  });
  it('should check author field for object value', () => {
    const license = {
      name: 'Verdaccion NPM',
      email: 'verdaccio@verdaccio.org',
      url: 'https://verdaccio.org'
    };
    expect(formatAuthor(license)).toEqual('Verdaccion NPM');
  });
  it('should check author field for other value', () => {
    expect(formatAuthor(null)).toBeNull();
    expect(formatAuthor({})).toBeNull();
    expect(formatAuthor([])).toBeNull();
  });
});

describe('formatDate', () => {
  it('should format the date', () => {
    const date = 1532211072138;
    expect(formatDate(date)).toEqual('2018/07/21, 22:11:12');
  });
});

describe('formatDateDistance', () => {
  it('should calculate the distance', () => {
    const dateOneMonthAgo = () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return date;
    };
    const date = dateOneMonthAgo();
    expect(formatDateDistance(date)).toEqual('about 1 month');
  });
});

describe('getLastUpdatedPackageTime', () => {
  it('should get the last update time', () => {
    const lastUpdated = packageMeta._uplinks;
    expect(getLastUpdatedPackageTime(lastUpdated)).toEqual(
      '2018/07/22, 22:11:12'
    );
  });
  it('should get the last update time for blank uplink', () => {
    const lastUpdated = {};
    expect(getLastUpdatedPackageTime(lastUpdated)).toEqual('');
  });
});

describe('getRecentReleases', () => {
  it('should get the recent releases', () => {
    const { time } = packageMeta;
    const result = [
      { time: '2017/12/14, 15:43:27', version: '2.7.1' },
      { time: '2017/12/05, 23:25:06', version: '2.7.0' },
      { time: '2017/11/08, 22:47:16', version: '2.6.6' }
    ];
    expect(getRecentReleases(time)).toEqual(result);
    expect(getRecentReleases()).toEqual([]);
  });
});
