import { logger, setup } from '../src';

describe('logger', () => {
  test('dsadasd', () => {
    const spyOn = jest.spyOn(process.stdout, 'write');
    setup([
      {
        level: 'info',
      },
    ]);

    logger.info({ packageName: 'test' }, `publishing or updating a new version for @{packageName}`);

    // expect(spyOn).toHaveBeenCalledTimes(2);
  });
});
