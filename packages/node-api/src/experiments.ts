const logger = require('@verdaccio/logger');

export function displayExperimentsInfoBox(experiments) {
  const experimentList = Object.keys(experiments);
  if (experimentList.length >= 1) {
    logger.logger.warn('⚠️  experiments are enabled, we recommend do not use experiments in production, comment out this section to disable it');
    experimentList.forEach((experiment) => {
      logger.logger.warn(` - support for ${experiment} ${experiments[experiment] ? 'is enabled' : ' is disabled'}`);
    });
  }
}
