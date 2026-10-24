import React from 'react';
import { describe, expect, test } from 'vitest';

import { fireEvent, renderWith, screen, within } from '../../test/test-react-testing-library';
import Help, { getSetupCommand } from './Help';

const REGISTRY = 'http://localhost:4873/';

describe('<Help /> component', () => {
  test('renders the welcome, the numbered steps and the uplinks note', () => {
    renderWith(<Help />, { login: true });
    const card = screen.getByTestId('help-card');
    expect(within(card).getByText('help.title')).toBeInTheDocument();
    expect(within(card).getByText('help.welcome')).toBeInTheDocument();
    expect(within(card).getAllByRole('listitem')).toHaveLength(4);
    expect(within(card).getByText('help.steps.configure.title')).toBeInTheDocument();
    expect(within(card).getByText('help.steps.login.title')).toBeInTheDocument();
    expect(within(card).getByText('help.steps.publish.title')).toBeInTheDocument();
    expect(within(card).getByText('help.steps.wait.title')).toBeInTheDocument();
    expect(screen.getByTestId('help-uplinks-note')).toBeInTheDocument();
    expect(screen.getByTestId('help-docs-link')).toHaveAttribute(
      'href',
      'https://verdaccio.org/docs/what-is-verdaccio'
    );
  });

  test('keeps the adduser and publish commands in the card', () => {
    renderWith(<Help />, { login: true });
    expect(screen.getByText('help.first-step-command-line')).toBeInTheDocument();
    expect(screen.getByText('help.second-step-command-line')).toBeInTheDocument();
  });

  test('skips the login step when the web login is disabled', () => {
    renderWith(<Help />, { login: false });
    expect(screen.queryByText('help.steps.login.title')).not.toBeInTheDocument();
    expect(screen.queryByText('help.first-step-command-line')).not.toBeInTheDocument();
    expect(within(screen.getByTestId('help-card')).getAllByRole('listitem')).toHaveLength(3);
  });

  test('offers a setup tab per configured package manager plus .npmrc', () => {
    renderWith(<Help />, { pkgManagers: ['pnpm', 'npm'], base: REGISTRY });
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'npm',
      'pnpm',
      '.npmrc',
    ]);
    expect(screen.getByText(`npm config set registry ${REGISTRY}`)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('help-setup-.npmrc'));
    expect(screen.getByText(`registry=${REGISTRY}`)).toBeInTheDocument();
  });

  test('shows bun publish and the login note only while the bun tab is selected', () => {
    renderWith(<Help />, { login: true, pkgManagers: ['npm', 'bun'], base: REGISTRY });
    expect(screen.getByTestId('help-publish-command')).toBeInTheDocument();
    expect(screen.queryByTestId('help-publish-command-bun')).not.toBeInTheDocument();
    expect(screen.queryByText('help.steps.login.bun-note')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('help-setup-bun'));
    expect(
      screen.getByText(/\[install\] registry = "http:\/\/localhost:4873\/"/)
    ).toBeInTheDocument();
    expect(screen.getByText(`bun publish --registry ${REGISTRY}`)).toBeInTheDocument();
    expect(screen.queryByTestId('help-publish-command')).not.toBeInTheDocument();
    expect(screen.getByText('help.steps.login.bun-note')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('help-setup-npm'));
    expect(screen.queryByTestId('help-publish-command-bun')).not.toBeInTheDocument();
    expect(screen.getByTestId('help-publish-command')).toBeInTheDocument();
  });

  test('replaces the guide with web.help and fills in the registry address', () => {
    renderWith(<Help />, { help: 'Run `npm config set registry {{registryUrl}}`', base: REGISTRY });
    expect(screen.getByTestId('help-card')).toBeInTheDocument();
    expect(screen.getByTestId('help-custom')).toHaveTextContent(
      `npm config set registry ${REGISTRY}`
    );
    expect(screen.queryByText('help.title')).not.toBeInTheDocument();
  });

  test('keeps the guide when web.help is blank', () => {
    renderWith(<Help />, { help: '   ' });
    expect(screen.queryByTestId('help-custom')).not.toBeInTheDocument();
    expect(screen.getByText('help.title')).toBeInTheDocument();
  });

  test('leaves bun out when it is not configured', () => {
    renderWith(<Help />, { login: true, pkgManagers: ['npm'], base: REGISTRY });
    expect(screen.queryByTestId('help-setup-bun')).not.toBeInTheDocument();
    expect(screen.queryByTestId('help-publish-command-bun')).not.toBeInTheDocument();
    expect(screen.queryByText('help.steps.login.bun-note')).not.toBeInTheDocument();
  });
});

describe('getSetupCommand', () => {
  test('scopes the registry when web.scope is set', () => {
    expect(getSetupCommand('npm', '@verdaccio', REGISTRY)).toBe(
      `npm config set @verdaccio:registry ${REGISTRY}`
    );
    expect(getSetupCommand('.npmrc', '@verdaccio', REGISTRY)).toBe(
      `@verdaccio:registry=${REGISTRY}`
    );
  });

  test('writes a .yarnrc.yml for yarn', () => {
    expect(getSetupCommand('yarn', undefined, REGISTRY)).toContain(
      `npmRegistryServer: "${REGISTRY}"`
    );
  });
});
