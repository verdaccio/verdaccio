import { logger } from '@verdaccio/logger';

export function displayExperimentsInfoBox(flags) {
  if (!flags) {
    return;
  }

  const experimentList = Object.keys(flags);
  if (experimentList.length >= 1) {
    logger.warn(
      `experiments are enabled, it is recommended do not use experiments in production comment out this section to disable it`
    );
    experimentList.forEach((experiment) => {
      logger.info(
        `support for experiment [${experiment}] ${
          flags[experiment] ? 'is enabled' : ' is disabled'
        }`
      );
    });
  }
}
