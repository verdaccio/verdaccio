import { describe, expect, test } from 'vitest';

import * as verdaccio from '../src';

/**
 * The public surface of the `verdaccio` package is a contract: people import these names
 * from their own code. It drifted once already — the 6.x, 7.x and 9.x lines each built this
 * entry point from a different file and ended up exporting different things, so upgrading
 * turned `require('verdaccio').default` into `undefined` with no warning.
 *
 * Pin it here. Adding an export should update this list deliberately; losing one should fail.
 */
describe('public api', () => {
  test('exports the documented names', () => {
    expect(Object.keys(verdaccio).sort()).toEqual([
      'Config',
      'ConfigBuilder',
      'default',
      'getDefaultConfig',
      'initServer',
      'parseConfigFile',
      'runServer',
    ]);
  });

  test('the default export is runServer', () => {
    expect(verdaccio.default).toBe(verdaccio.runServer);
  });
});
