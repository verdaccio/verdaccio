import { describe, expect, it } from 'vitest';

// Update the import path accordingly
import { UnPublishManifest } from '@verdaccio/types';

import { generateUnPublishPackageMetadata } from '../src/generateUnPublishPackageMetadata';

describe('generateUnPublishPackageMetadata', () => {
  it('should generate metadata for a single version', () => {
    const pkgName = 'test-package';
    const versions = ['1.0.0'];
    const distTags = { latest: '1.0.0' };
    const rev = '1-abc';

    const result: UnPublishManifest = generateUnPublishPackageMetadata(
      pkgName,
      versions,
      distTags,
      rev
    );

    expect(result._id).toBe(pkgName);
    expect(result.name).toBe(pkgName);
    expect(result['dist-tags']).toEqual(distTags);
    expect(result.versions['1.0.0']).toBeDefined();
    expect(result.versions['1.0.0'].name).toBe(pkgName);
    expect(result.versions['1.0.0'].version).toBe('1.0.0');
    expect(result._rev).toBe(rev);
    expect(result.time?.created).toBeDefined();
    expect(result.time?.modified).toBeDefined();
    expect(result.time?.['1.0.0']).toBeDefined();
  });

  it('should generate metadata for multiple versions', () => {
    const pkgName = 'test-package';
    const versions = ['1.0.0', '2.0.0'];
    const distTags = { latest: '2.0.0' };
    const rev = '1-xyz';

    const result: UnPublishManifest = generateUnPublishPackageMetadata(
      pkgName,
      versions,
      distTags,
      rev
    );

    expect(result._id).toBe(pkgName);
    expect(result.name).toBe(pkgName);
    expect(result['dist-tags']).toEqual(distTags);
    expect(result.versions['1.0.0']).toBeDefined();
    expect(result.versions['1.0.0'].version).toBe('1.0.0');
    expect(result.versions['2.0.0']).toBeDefined();
    expect(result.versions['2.0.0'].version).toBe('2.0.0');
    expect(result._rev).toBe(rev);
    expect(result.time?.['1.0.0']).toBeDefined();
    expect(result.time?.['2.0.0']).toBeDefined();
  });

  it('should include default metadata fields', () => {
    const pkgName = 'default-test';
    const versions = ['1.0.0'];
    const distTags = { latest: '1.0.0' };
    const rev = '1-def';

    const result: UnPublishManifest = generateUnPublishPackageMetadata(
      pkgName,
      versions,
      distTags,
      rev
    );

    const versionData = result.versions['1.0.0'];
    expect(versionData).toMatchObject({
      name: pkgName,
      version: '1.0.0',
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      author: {
        name: 'Verdaccio Maintainers',
        email: 'verdaccio.npm@gmail.com',
      },
      repository: {
        type: 'git',
        url: 'https://github.com/verdaccio/verdaccio.git',
      },
      homepage: 'https://verdaccio.org',
      funding: {
        type: 'opencollective',
        url: 'https://opencollective.com/verdaccio',
      },
      license: 'ISC',
    });
    expect(versionData.dist).toBeDefined();
    expect(versionData.maintainers).toContainEqual({ name: 'test', email: '' });
  });
});
