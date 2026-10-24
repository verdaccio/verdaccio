import React from 'react';
import { describe, expect, test } from 'vitest';

import { fireEvent, renderWith, screen, within } from '../../test/test-react-testing-library';
import HeaderSettingsDialog from './HeaderSettingsDialog';

const openPublishTab = () => {
  fireEvent.click(screen.getByTestId('settings-publish-tab'));
  return screen.getByTestId('settings-publish');
};

describe('<HeaderSettingsDialog /> publishing tab', () => {
  test('keeps the publishing guide reachable without the empty-registry wait step', () => {
    renderWith(<HeaderSettingsDialog isOpen={true} onCloseDialog={() => {}} />, { login: true });
    const panel = openPublishTab();
    expect(within(panel).getByTestId('help-guide')).toBeInTheDocument();
    expect(within(panel).getAllByRole('listitem')).toHaveLength(3);
    expect(within(panel).getByText('help.second-step-command-line')).toBeInTheDocument();
    expect(within(panel).queryByText('help.steps.wait.title')).not.toBeInTheDocument();
    expect(within(panel).queryByTestId('help-uplinks-note')).not.toBeInTheDocument();
    // the documentation link lives once in the dialog footer, not in each tab
    expect(within(panel).queryByText('button.learn-more')).not.toBeInTheDocument();
    expect(screen.getByTestId('registryInfo--dialog-docs')).toHaveAttribute(
      'href',
      'https://verdaccio.org/docs/what-is-verdaccio'
    );
  });

  test('shows the web.help markdown instead of the guide when it is set', () => {
    renderWith(<HeaderSettingsDialog isOpen={true} onCloseDialog={() => {}} />, {
      help: 'Read the platform guide',
    });
    const panel = openPublishTab();
    expect(within(panel).getByTestId('help-custom')).toHaveTextContent('Read the platform guide');
    expect(within(panel).queryByTestId('help-guide')).not.toBeInTheDocument();
  });
});
