import { logger } from '@verdaccio/logger';

export function displayExperimentsInfoBox(flags) {
  if (!flags) {
    return {
      searchRemote: false,
    };
  }

  const experimentList = Object.keys(flags);
  if (experimentList.length >= 1) {
    logger.warn(
      // eslint-disable-next-line max-len
      `experiments are enabled, it is recommended do not use experiments in production comment out this section to disable it`
    );
    experimentList.forEach((experiment) => {
      // eslint-disable-next-line max-len
      logger.info(
        `support for experiment [${experiment}] ${
          flags[experiment] ? 'is enabled' : ' is disabled'
        }`
      );
    });
  }
  return { ...flags, searchRemote: false };
}
