import assert from 'assert';
import { describe, test } from 'vitest';

import { setup } from '../../../../src/lib/logger';
import { tagVersion } from '../../../../src/lib/utils';

setup({});

describe('tagVersion', () => {
  test('add new one', () => {
    let pkg = {
      versions: {},
      'dist-tags': {},
    };

    // @ts-ignore
    assert(tagVersion(pkg, '1.1.1', 'foo', {}));
    assert.deepEqual(pkg, {
      versions: {},
      'dist-tags': { foo: '1.1.1' },
    });
  });

  test('add (compat)', () => {
    const x = {
      versions: {},
      'dist-tags': { foo: '1.1.0' },
    };

    // @ts-ignore
    assert(tagVersion(x, '1.1.1', 'foo'));
    assert.deepEqual(x, {
      versions: {},
      'dist-tags': { foo: '1.1.1' },
    });
  });

  test('add fresh tag', () => {
    let x = {
      versions: {},
      'dist-tags': { foo: '1.1.0' },
    };

    // @ts-ignore
    assert(tagVersion(x, '1.1.1', 'foo'));
    assert.deepEqual(x, {
      versions: {},
      'dist-tags': { foo: '1.1.1' },
    });
  });
});
