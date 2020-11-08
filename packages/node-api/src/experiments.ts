import buildDebug from 'debug';

const debug = buildDebug('verdaccio:runtime:flags');

export function displayExperimentsInfoBox(flags) {
  if (!flags) {
    return;
  }

  const experimentList = Object.keys(flags);
  if (experimentList.length >= 1) {
    debug(
      '⚠️  experiments are enabled, we recommend do not use experiments in production, ' +
        'comment out this section to disable it'
    );
    experimentList.forEach((experiment) => {
      debug(` - support for %o %o`, experiment, flags[experiment] ? 'is enabled' : ' is disabled');
    });
  }
}
