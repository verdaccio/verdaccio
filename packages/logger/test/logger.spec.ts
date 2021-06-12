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
});
