import { displayWarning, displayMessage } from '@verdaccio/cli-ui';

export function displayExperimentsInfoBox(flags) {
  if (!flags) {
    return;
  }

  const experimentList = Object.keys(flags);
  if (experimentList.length >= 1) {
    displayWarning(
      '⚠️  experiments are enabled, we recommend do not use experiments in production, ' +
        'comment out this section to disable it'
    );
    experimentList.forEach((experiment) => {
      displayMessage(
        ` - support for ${experiment} ${flags[experiment] ? 'is enabled' : ' is disabled'}
      `
      );
    });
  }
}
