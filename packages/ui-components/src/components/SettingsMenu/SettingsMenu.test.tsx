import React from 'react';

import { fireEvent, render, screen } from '../../test/test-react-testing-library';
import SettingsMenu from './SettingsMenu';

describe('<SettingsMenu />', () => {
  test('should handle menu open and close', async () => {
    render(<SettingsMenu packageName="foo" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await screen.findByRole('menu');
    // TODO onClose
  });

  test('should handle latest select', () => {
    const { getByRole, getByText } = render(<SettingsMenu packageName="foo" />);
    const button = getByRole('button');
    fireEvent.click(button);
    const menuItem = getByText('sidebar.installation.latest');
    fireEvent.click(menuItem);
    expect(getByText('sidebar.installation.latest')).toBeInTheDocument();
  });

  test('should handle global select', () => {
    const { getByRole, getByText } = render(<SettingsMenu packageName="foo" />);
    const button = getByRole('button');
    fireEvent.click(button);
    const menuItem = getByText('sidebar.installation.global');
    fireEvent.click(menuItem);
    expect(getByText('sidebar.installation.global')).toBeInTheDocument();
  });

  test('should handle yarn modern select', () => {
    const { getByRole, getByText } = render(<SettingsMenu packageName="foo" />);
    const button = getByRole('button');
    fireEvent.click(button);
    const menuItem = getByText('sidebar.installation.yarnModern');
    fireEvent.click(menuItem);
    expect(getByText('sidebar.installation.yarnModern')).toBeInTheDocument();
  });
});
