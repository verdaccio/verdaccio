import * as factory from '../src';

describe('prettyFactory', () => {
  const prettyfierOptions = { messageKey: 'msg', levelFirst: true, prettyStamp: false };
  test('should return a function', () => {
    expect(typeof factory['default']({})).toEqual('function');
  });

  test('should return a function', () => {
    const log = {
      level: 10,
      foo: 'foo',
      msg: '[trace]  - @{foo}',
    };

    expect(factory['default'](prettyfierOptions)(log)).toMatchSnapshot();
  });
});
