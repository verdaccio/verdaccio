import React from 'react';
import { vi } from 'vitest';

import { fireEvent, render, screen } from '../../test/test-react-testing-library';
import HeaderInfoDialog from './HeaderInfoDialog';

describe('HeaderInfoDialog', () => {
  const onCloseDialog = vi.fn();

  const tabs = [{ label: 'Tab 1' }, { label: 'Tab 2' }];

  const tabPanels = [{ element: <div>{'Panel 1'}</div> }, { element: <div>{'Panel 2'}</div> }];

  beforeEach(() => {
    render(
      <HeaderInfoDialog
        dialogTitle="Dialog Title"
        isOpen={true}
        onCloseDialog={onCloseDialog}
        tabPanels={tabPanels}
        tabs={tabs}
      />
    );
  });

  test('renders without crashing', () => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('displays the dialog title', () => {
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
  });

  test('renders the tabs correctly', () => {
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
  });

  test('renders the tab panels correctly', async () => {
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    // Panel 2 should not be visible initially
    expect(screen.queryByText('Panel 2')).not.toBeInTheDocument();
    // Switch to Tab 2
    fireEvent.click(screen.getByText('Tab 2'));
    await expect(screen.queryByText('Panel 2')).toBeInTheDocument();
  });

  test('calls onCloseDialog when the dialog is closed', () => {
    fireEvent.click(screen.getByRole('button'));
    expect(onCloseDialog).toHaveBeenCalled();
  });
});
