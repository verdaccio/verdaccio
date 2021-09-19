import { logger, setup } from '../src';

describe('logger', () => {
  test('dsadasd', () => {
    jest.spyOn(process.stdout, 'write');
    setup([
      {
        level: 'info',
      },
    ]);

    logger.info({ packageName: 'test' }, `publishing or updating a new version for @{packageName}`);
    // FIXME: check expect
    // expect(spyOn).toHaveBeenCalledTimes(2);
  });

  test('throw deprecation warning if multiple loggers configured', () => {
    const spy = jest.spyOn(process, 'emitWarning');
    setup([
      {
        level: 'info',
      },
      {
        level: 'http',
      },
    ]);
    expect(spy).toHaveBeenCalledWith(
      'deprecate: multiple logger configuration is deprecated, please check the migration guide.'
    );
    spy.mockRestore();
  });

  test('regression: do not throw deprecation warning if no logger config is provided', () => {
    const spy = jest.spyOn(process, 'emitWarning');
    setup();
    expect(spy).not.toHaveBeenCalledWith(
      'deprecate: multiple logger configuration is deprecated, please check the migration guide.'
    );
    spy.mockRestore();
  });
});
