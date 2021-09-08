import { getMatchedPackagesSpec } from '../src/matcher';

describe('getMatchedPackagesSpec', () => {
  test('should test basic config', () => {
    const packages = {
      react: {
        access: 'admin',
        publish: 'admin',
        proxy: 'facebook',
      },
      angular: {
        access: 'admin',
        publish: 'admin',
        proxy: 'google',
      },
      '@*/*': {
        access: '$all',
        publish: '$authenticated',
        proxy: 'npmjs',
      },
      '**': {
        access: '$all',
        publish: '$authenticated',
        proxy: 'npmjs',
      },
    };
    // @ts-expect-error
    expect(getMatchedPackagesSpec('react', packages).proxy).toMatch('facebook');
    // @ts-expect-error
    expect(getMatchedPackagesSpec('angular', packages).proxy).toMatch('google');
    // @ts-expect-error
    expect(getMatchedPackagesSpec('vue', packages).proxy).toMatch('npmjs');
    // @ts-expect-error
    expect(getMatchedPackagesSpec('@scope/vue', packages).proxy).toMatch('npmjs');
  });

  test('should test no ** wildcard on config', () => {
    const packages = {
      react: {
        access: 'admin',
        publish: 'admin',
        proxy: 'facebook',
      },
      angular: {
        access: 'admin',
        publish: 'admin',
        proxy: 'google',
      },
      '@fake/*': {
        access: '$all',
        publish: '$authenticated',
        proxy: 'npmjs',
      },
    };
    // @ts-expect-error
    expect(getMatchedPackagesSpec('react', packages).proxy).toMatch('facebook');
    // @ts-expect-error
    expect(getMatchedPackagesSpec('angular', packages).proxy).toMatch('google');
    // @ts-expect-error
    expect(getMatchedPackagesSpec('@fake/angular', packages).proxy).toMatch('npmjs');
    expect(getMatchedPackagesSpec('vue', packages)).toBeUndefined();
    expect(getMatchedPackagesSpec('@scope/vue', packages)).toBeUndefined();
  });
});
