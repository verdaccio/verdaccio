import React from 'react';
import { describe, expect, test } from 'vitest';

import { renderWith, screen } from '../../test/test-react-testing-library';
import RegistryInfoDialog from './RegistryInfoDialog';

describe('<RegistryInfoDialog />', () => {
  test('puts one external documentation link in the footer', () => {
    renderWith(
      <RegistryInfoDialog
        docsUrl="https://verdaccio.org/docs/what-is-verdaccio"
        onClose={() => {}}
        open={true}
        title="Configuration"
      >
        <div>{'content'}</div>
      </RegistryInfoDialog>
    );
    const link = screen.getByTestId('registryInfo--dialog-docs');
    expect(link).toHaveAttribute('href', 'https://verdaccio.org/docs/what-is-verdaccio');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveTextContent('dialog.opens-in-new-tab');
  });

  test('has no documentation link unless one is given', () => {
    renderWith(
      <RegistryInfoDialog onClose={() => {}} open={true} title="Information">
        <div>{'content'}</div>
      </RegistryInfoDialog>
    );
    expect(screen.queryByTestId('registryInfo--dialog-docs')).not.toBeInTheDocument();
  });
});
