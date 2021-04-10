import { addNpmPrefix } from './registry';

describe('registry utils', function () {
  test('prefix', () => {
    expect([...addNpmPrefix('foo')]).toEqual('');
  });
});
